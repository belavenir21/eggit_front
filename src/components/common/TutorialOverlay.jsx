import { useEffect, useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useTutorialStore from '../../store/useTutorialStore';
import useUserStore from '../../store/useUserStore';
import { ArrowRight } from 'lucide-react';
import { getTutorialStep, getTutorialSteps } from '../../config/tutorialSteps';
import tutorialCursor from '../../assets/images/tutorial_cursor.png';

import { getAnimalNameWithPrefix, animalNames } from '../../utils/avatarUtils';

const getAvatarName = (avatar) => {
    if (!avatar) return "캐릭터";
    return getAnimalNameWithPrefix(avatar.match_type, avatar.growth_stage);
};

/**
 * 튜토리얼 오버레이 컴포넌트 (딸기우유맛 v5.5 - 블로그 포스팅 마스크 제거 & 마지막 스텝 확장 최적화)
 */
const TutorialOverlay = ({ page }) => {
    const navigate = useNavigate();
    const { isActive, currentPage, currentStep, nextStep, skipTutorial, endTutorial } = useTutorialStore();
    const { avatar } = useUserStore();
    const [isMirror, setIsMirror] = useState(false);
    const [showSkipOptions, setShowSkipOptions] = useState(false);

    // [Fix] 현재 렌더링된 컴포넌트의 page 프롭과 스토어의 currentPage가 일치할 때만 활성화
    const isVisiblePage = isActive && currentPage === page;

    const steps = useMemo(() => getTutorialSteps(page), [page]);
    const stepData = isVisiblePage ? steps[currentStep] : null;

    // 1. {avatarName} 치환용 로직
    const step = useMemo(() => {
        if (!isVisiblePage || !stepData) return null;
        return {
            ...stepData,
            message: stepData.message.replace(/{avatarName}/g, getAvatarName(avatar))
        };
    }, [stepData, avatar, isVisiblePage]);

    // 💡 성능 최적화를 위한 Ref 접근 (Direct DOM Manipulation)
    const highlightRef = useRef(null);
    const tooltipRef = useRef(null);
    const maskRef = useRef(null);

    // 스텝이나 페이지가 바뀌면 스킵 옵션을 닫음
    useEffect(() => {
        setShowSkipOptions(false);
    }, [currentStep, currentPage]);

    // [New] 페이지 전환 시 스토어 페이지 상태 강제 동기화
    useEffect(() => {
        if (isActive && !isVisiblePage && currentPage === null) {
            useTutorialStore.setState({ currentPage: page });
        }
    }, [isActive, isVisiblePage, page, currentPage]);

    // 2. 툴팁 위치 계산 함수
    const calculateTooltipPosition = useCallback((rect, position) => {
        // 마지막 스텝 유무 판단 (ID가 farewell이거나 해당 페이지의 마지막 인덱스인 경우)
        const steps = getTutorialSteps(page);
        const isLastStep = step?.id === 'farewell' || (steps.length > 0 && currentStep === steps.length - 1);

        // 마지막 작별 스텝인 경우 가로를 더 길게 (620px로 소폭 추가 확장)
        const tooltipWidth = isLastStep ? 620 : 400;
        const tooltipHeight = 160;
        let gap = 20;

        let top = 0;
        let left = 0;

        const isBlogCreation = page === 'blog-creation';
        const finalPosition = isBlogCreation ? 'right-fixed' : position;

        switch (finalPosition) {
            case 'center':
                top = window.innerHeight / 2 - tooltipHeight / 2 - 50;
                left = window.innerWidth / 2 - tooltipWidth / 2;
                break;
            case 'right-fixed':
                top = 100;
                left = window.innerWidth - tooltipWidth - 60;
                break;
            case 'top':
                top = rect.top - tooltipHeight - gap;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'top-right':
                top = rect.top - tooltipHeight - gap;
                left = rect.right - tooltipWidth + 12;
                break;
            case 'bottom':
                top = rect.bottom + gap;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'left':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.left - tooltipWidth - gap;
                break;
            case 'right':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.right + gap;
                break;
            case 'bottom-right-inner':
                top = rect.bottom - tooltipHeight - 20;
                left = rect.right - tooltipWidth - 20;
                break;
            default:
                top = rect.bottom + gap;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
        }

        if (finalPosition !== 'right-fixed' && finalPosition !== 'center') {
            if (left < 20) left = 20;
            if (left + tooltipWidth > window.innerWidth - 20) left = window.innerWidth - tooltipWidth - 20;
            if (top < 20) top = 20;
            if (top + tooltipHeight > window.innerHeight - 20) top = window.innerHeight - tooltipHeight - 20;
        }

        const mirror = isBlogCreation ? true : (left >= window.innerWidth / 2);
        const charBottom = top < 150 ? -95 : -45;

        return { top, left, mirror, charBottom, tooltipWidth };
    }, [page, step?.id, currentStep]);

    // 3. 타겟 위치 추적 및 RAF 실시간 반영
    useLayoutEffect(() => {
        if (!isActive || !step || !isVisiblePage) return;

        let rafId;
        const updateHighlight = () => {
            const targetElement = document.querySelector(step.target);
            const maskEl = maskRef.current;
            const highlightEl = highlightRef.current;
            const tooltipEl = tooltipRef.current;

            if (targetElement || step.target === 'body') {
                const rect = targetElement
                    ? targetElement.getBoundingClientRect()
                    : { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 };

                const padding = 12;
                const hTop = rect.top - padding;
                const hLeft = rect.left - padding;
                const hWidth = rect.width + padding * 2;
                const hHeight = rect.height + padding * 2;

                if (highlightEl) {
                    highlightEl.style.width = `${hWidth}px`;
                    highlightEl.style.height = `${hHeight}px`;
                    highlightEl.style.transform = `translate3d(${hLeft}px, ${hTop}px, 0)`;
                }

                if (maskEl) {
                    // 💡 블로그 포스팅 페이지는 사용자의 자유로운 조작을 위해 마스크를 기본적으로 제거함 (투명화)
                    // 단, 'markdown-intro' 단계(첫 안내)에서는 마스크를 보여줌
                    const isMaskDisabled = (page === 'blog-posting' && step?.id !== 'markdown-intro');

                    if (step.position === 'center' || isMaskDisabled) {
                        maskEl.style.clipPath = 'none';
                    } else {
                        maskEl.style.clipPath = `polygon(
                            0% 0%, 0% 100%, 
                            ${hLeft}px 100%, 
                            ${hLeft}px ${hTop}px, 
                            ${hLeft + hWidth}px ${hTop}px, 
                            ${hLeft + hWidth}px ${hTop + hHeight}px, 
                            ${hLeft}px ${hTop + hHeight}px, 
                            ${hLeft}px 100%, 
                            100% 100%, 100% 0%
                        )`;
                    }
                }

                const { top, left, mirror, charBottom, tooltipWidth } = calculateTooltipPosition(rect, step.position);
                if (tooltipEl) {
                    tooltipEl.style.transform = `translate3d(${left}px, ${top}px, 0)`;
                    tooltipEl.style.width = `min(calc(100vw - 40px), ${tooltipWidth}px)`;
                }

                const charEl = tooltipEl?.querySelector('.guide-char-container');
                if (charEl) {
                    charEl.style.bottom = `${charBottom}px`;
                }

                setIsMirror(mirror);
            }
            rafId = requestAnimationFrame(updateHighlight);
        };

        rafId = requestAnimationFrame(updateHighlight);
        window.addEventListener('resize', updateHighlight);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', updateHighlight);
        };
    }, [isActive, step, isVisiblePage, currentStep, page, calculateTooltipPosition]);

    const handleAction = () => {
        if (step?.nextPage) {
            if (step.nextPage === 'main') {
                navigate('/');
            } else if (step.nextPage === 'blog-creation') {
                navigate('/blog/create');
            } else if (step.nextPage === 'blog-posting') {
                navigate('/blog/post');
            }
            nextStep(step.nextPage, step.nextStep || 0);
        } else {
            nextStep();
        }
    };

    const handleTargetClick = (e) => {
        if (step?.action === 'click') {
            if (step.trigger) {
                if (e.target.closest(step.trigger)) {
                    handleAction();
                }
            } else {
                handleAction();
            }
        }
    };

    useEffect(() => {
        if (!isActive || !step || step.action !== 'click' || !isVisiblePage) return;
        const targetElement = document.querySelector(step.target);
        if (!targetElement) return;
        targetElement.addEventListener('click', handleTargetClick);
        return () => targetElement.removeEventListener('click', handleTargetClick);
    }, [isActive, step, isVisiblePage]);

    // 마지막 단계 체크
    useEffect(() => {
        if (isActive && isVisiblePage && !step && currentStep > 0) {
            endTutorial();
        }
    }, [isActive, step, currentStep, isVisiblePage]);

    if (!isActive || !step || !isVisiblePage) return null;

    const isWelcomeStep = currentStep === 0 && page === 'main';
    const isStartAskStep = currentStep === 1 && page === 'main';
    const isLastStep = step.id === 'farewell' || (page === 'main' && currentStep === getTutorialSteps('main').length - 1);

    return (
        <>
            {/* 🛡️ 튜토리얼 전체 마스크 */}
            <div
                ref={maskRef}
                className={`fixed inset-0 z-[9990] bg-black/60 transition-all duration-300 
                    ${(page === 'blog-posting' && step.id !== 'markdown-intro') ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`}

                onClick={(e) => {
                    if (showSkipOptions) setShowSkipOptions(false);
                    e.preventDefault();
                    e.stopPropagation();
                }}
            />

            {/* 🔦 하이라이트 테두리 */}
            {step.position !== 'center' && (page !== 'blog-posting') && (
                <div
                    ref={highlightRef}
                    className="fixed z-[9995] pointer-events-none border-[3px] border-[#ff85a1] rounded-2xl shadow-[0_0_25px_rgba(255,133,161,0.6)] transition-none"
                    style={{
                        top: 0, left: 0, width: 0, height: 0,
                        transform: 'translate3d(0, 0, 0)',
                        willChange: 'transform, width, height'
                    }}
                />
            )}

            {/* 💬 메시지 패널 */}
            <div
                ref={tooltipRef}
                className="fixed z-[10000] pointer-events-auto tutorial-tooltip-container"
                style={{
                    top: 0, left: 0,
                    transform: 'translate3d(0, 0, 0)',
                    transition: 'none',
                    willChange: 'transform',
                    overflowWrap: 'break-word'
                }}
            >
                <div
                    className="absolute z-[10001] pointer-events-none guide-char-container"
                    style={{
                        bottom: '-45px',
                        left: isMirror ? '-130px' : 'auto',
                        right: isMirror ? 'auto' : '-130px',
                        transform: `scaleX(${isMirror ? -1 : 1})`,
                        transition: 'bottom 0.3s ease'
                    }}
                >
                    <img
                        src={tutorialCursor}
                        alt="Guide"
                        className="w-44 h-44 object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.15)] animate-tutorial-float"
                    />
                </div>

                <div className="bg-[#fffdfd] rounded-[24px] shadow-[0_30px_60px_rgba(255,182,193,0.3)] p-4 border-2 border-[#ffe4e9] relative overflow-visible">
                    <div className="flex justify-end mb-1 gap-2">
                        <button
                            onClick={skipTutorial}
                            className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[9px] text-gray-300 hover:text-gray-500 hover:border-gray-500 font-black transition-all shadow-sm active:scale-95 tutorial-overlay-ignore"
                        >
                            END TUTORIAL
                        </button>
                    </div>

                    <div className="min-h-[40px] flex flex-col justify-center">
                        <p
                            className="text-[15px] text-[#5a484b] font-medium leading-relaxed px-2 break-keep"
                            style={{ overflowWrap: 'break-word', wordBreak: 'keep-all' }}
                            dangerouslySetInnerHTML={{ __html: step.message.replace(/\*\*(.*?)\*\*/g, '<b class="text-[#ff6b8e] font-black">$1</b>').replace(/\n/g, '<br/>') }}
                        />
                    </div>

                    <div className="mt-4 flex justify-end items-center gap-3">
                        {step.action === 'confirm' ? (
                            <button
                                onClick={handleAction}
                                className="px-8 py-2 bg-[#ff85a1] text-white text-[13px] font-black rounded-full shadow-[0_6_15px_rgba(255,133,161,0.3)] hover:bg-[#ff6b8e] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all tutorial-overlay-ignore"
                            >
                                {isStartAskStep ? '시작하기' : (isLastStep ? '종료하기' : (isWelcomeStep ? '다음' : '다음'))}
                            </button>
                        ) : (
                            <>
                                <div className="px-4 py-1.5 rounded-full bg-[#fff5f7] border border-[#ffe4e9] text-[#ff85a1] text-[10px] font-black flex items-center gap-1.5 shadow-sm">
                                    <span className="text-sm">👆</span>
                                    <span>{page === 'blog-posting' ? '자유롭게 사용해보세요' : '해당 영역을 클릭해보세요!'}</span>
                                </div>
                                {/* Action Button */}
                                {(step.action === 'confirm' || (step.action === 'click' && step.nextPage)) && (
                                    <button
                                        onClick={handleAction}
                                        className="p-2.5 bg-[#ff85a1] text-white rounded-xl hover:bg-[#ff6b8d] transition-all shadow-lg shadow-[#ffb3c1]/40 active:scale-90 flex items-center justify-center tutorial-overlay-ignore border-2 border-white/20"
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TutorialOverlay;
