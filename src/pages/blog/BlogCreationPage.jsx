import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCreationSettings from '../../components/blog/BlogCreationSettings';
import BlogPreview from '../../components/blog/BlogPreview';
import FloatingBackButton from '../../components/common/FloatingBackButton';
import ConfirmModal from '../../components/common/ConfirmModal';
import useRepoStore from '../../store/useRepoStore';
import useNotificationStore from '../../store/useNotificationStore';
import useDeploymentStore from '../../store/useDeploymentStore';
import useUserStore from '../../store/useUserStore';
import useAuthStore from '../../store/useAuthStore';
import TutorialOverlay from '../../components/common/TutorialOverlay';
import apiClient from '../../utils/apiClient';


export default function BlogCreationPage() {
    const navigate = useNavigate();
    const { fetchRepos } = useRepoStore();
    const { notify } = useNotificationStore();
    const { startDeploy, failDeploy } = useDeploymentStore();
    const { user } = useAuthStore();

    // 1. 기본 상태
    const [repositoryName, setRepositoryName] = useState('');
    const [blogTemplate, setBlogTemplate] = useState('tech');
    const [blogTitle, setBlogTitle] = useState('');
    const [blogDescription, setBlogDescription] = useState('');
    const [blogTagline, setBlogTagline] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // [New] 모달 상태 관리
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null
    });

    // Theme State
    const [customTheme, setCustomTheme] = useState({
        font_import_url: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap",
        font_family_base: "'Noto Sans KR', sans-serif",
        main_bg: "#f0f8ff",
        sidebar_bg: "#2c3e50",
        sidebar_text: "#ffffff",
        active_color: "#00cd1b",
        card_bg: "#ffffff"
    });


    const username = user?.username || "my-username"; // Fallback 유지

    // 유저 정보 로드 시 닉네임 기본값 설정
    useEffect(() => {
        if (user?.username && !nickname) {
            setNickname(user.username);
        }
    }, [user, nickname]);

    // Theme Preset Logic
    useEffect(() => {
        if (blogTemplate === 'docs') {
            fetchRepos();
            setCustomTheme(prev => ({
                ...prev,
                main_bg: "#ffffff",
                sidebar_bg: "#f5f6fa",
                sidebar_text: "#333333",
                active_color: "#7253ed",
                card_bg: "#ffffff"
            }));
        } else {
            setCustomTheme(prev => ({
                ...prev,
                main_bg: "#f0f8ff",
                sidebar_bg: "#2c3e50",
                sidebar_text: "#ffffff",
                active_color: "#00cd1b",
                card_bg: "#ffffff"
            }));
        }
    }, [blogTemplate, fetchRepos]);

    const handleDeploy = async (isForce = false) => {
        // [Validation] 필수 입력값 체크 보강
        if (!blogTitle?.trim()) {
            notify("블로그 제목(Project Name)을 입력해주세요.", "error");
            return;
        }
        if (blogTemplate === 'docs' && !repositoryName) {
            notify("연동할 저장소(Repository)를 선택해주세요.", "error");
            return;
        }

        if (isForce) {
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        }

        setIsLoading(true);

        try {
            let urlPath = '';
            let payload = {};

            if (blogTemplate === 'tech') {
                urlPath = '/blog/main';
                payload = {
                    blog_title: blogTitle.trim(),
                    blog_tagline: blogTagline?.trim() || "My Awesome Tech Blog",
                    description: blogDescription?.trim() || "",
                    author_name: nickname?.trim() || username,
                    author_email: email?.trim() || null,
                    theme_settings: customTheme,
                    github_username: username,
                    is_force: isForce,
                    avatar_url: (avatarUrl && typeof avatarUrl === 'string') ? avatarUrl.trim() : null
                };
            } else {
                urlPath = '/blog/docs';
                const targetRepo = repositoryName.includes('/')
                    ? repositoryName
                    : `${username}/${repositoryName}`;

                payload = {
                    target_repo: targetRepo,
                    project_name: blogTitle.trim(),
                    description: blogDescription?.trim() || "",
                    theme_settings: customTheme,
                    is_force: isForce
                };
            }

            const response = await apiClient.post(urlPath, payload);
            const data = response.data;

            // [Deployment] 배포 작업 시작 및 전역 상태 동기화
            if (data?.task_id) {
                notify("🚀 블로그 생성이 시작되었습니다! 메인 화면에서 아바타가 진행 상황을 알려줄 거예요.", "success");
                startDeploy(data.task_id, {
                    taskType: 'blog_creation',
                    blogInfo: {
                        blogName: blogTitle,
                        blogType: blogTemplate
                    }
                });
            } else {
                notify("블로그 생성 요청이 접수되었습니다.", "info");
            }

            // 메인 페이지로 이동 (아바타가 진행상황 중계)
            navigate('/');


        } catch (error) {
            console.error("❌ Deployment Error:", error);

            if (error.response?.status === 409) {
                setModalConfig({
                    isOpen: true,
                    title: "⚠️ Blog Already Exists",
                    message: `해당 블로그(또는 브랜치)가 이미 존재합니다.\n기존 내용을 삭제하고 덮어씌우시겠습니까?\n(이 작업은 되돌릴 수 없습니다)`,
                    onConfirm: () => handleDeploy(true)
                });
                return;
            }

            notify(`배포 요청 실패: ${error.response?.data?.detail || error.message}`, "error");
            failDeploy(error.response?.data?.detail || error.message);
        } finally {
            // 모달이 열리는 경우(409)를 제외하고 로딩 해제
            if (!modalConfig.isOpen || isForce) {
                setIsLoading(false);
            }
        }
    };

    return (
        <>


            <ConfirmModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    setIsLoading(false);
                }}
                onConfirm={modalConfig.onConfirm}
                confirmText="Overwrite (Force)"
                isProcessing={isLoading}
            />

            <div className="h-screen bg-gray-50 flex overflow-hidden">
                <BlogCreationSettings
                    repositoryName={repositoryName}
                    setRepositoryName={setRepositoryName}
                    blogTemplate={blogTemplate}
                    setBlogTemplate={setBlogTemplate}
                    nickname={nickname}
                    setNickname={setNickname}
                    email={email}
                    setEmail={setEmail}
                    blogTitle={blogTitle}
                    setBlogTitle={setBlogTitle}
                    blogDescription={blogDescription}
                    setBlogDescription={setBlogDescription}
                    blogTagline={blogTagline}
                    setBlogTagline={setBlogTagline}
                    customTheme={customTheme}
                    setCustomTheme={setCustomTheme}
                    username={username}
                    onDeploy={() => handleDeploy(false)}
                    isLoading={isLoading}
                    avatarUrl={avatarUrl}
                    setAvatarUrl={setAvatarUrl}
                />

                <BlogPreview
                    blogTitle={blogTitle}
                    blogDescription={blogTagline || blogDescription}
                    customTheme={customTheme}
                    isLoading={isLoading}
                    blogTemplate={blogTemplate}
                    nickname={nickname || username}
                    avatarUrl={avatarUrl}
                />
            </div>

            <TutorialOverlay page="blog-creation" />
        </>
    );
}