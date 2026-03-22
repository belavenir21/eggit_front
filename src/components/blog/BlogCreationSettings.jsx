import { useEffect, useState, useRef } from 'react';
import useRepoStore from '../../store/useRepoStore';
import { RefreshCw, Palette, Image as ImageIcon, UploadCloud, X, Loader2 } from 'lucide-react';
import useNotificationStore from '../../store/useNotificationStore';
import FloatingBackButton from '../../components/common/FloatingBackButton';


export default function BlogCreationSettings({
    repositoryName,
    setRepositoryName,
    blogTemplate,
    setBlogTemplate,
    nickname,
    setNickname,
    blogTitle,
    setBlogTitle,
    blogDescription,
    setBlogDescription,
    blogTagline,
    setBlogTagline,
    email,
    setEmail,
    username,
    customTheme,
    setCustomTheme,
    onDeploy,
    isLoading,
    avatarUrl,
    setAvatarUrl
}) {
    const { repos, fetchRepos, isLoading: isRepoLoading } = useRepoStore();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // [New] 단일 컬러 피커 제어 (팝업 위치 고정을 위해)
    const [pickingColorKey, setPickingColorKey] = useState(null);
    const hiddenColorInputRef = useRef(null);

    useEffect(() => {
        if (blogTemplate === 'docs') {
            fetchRepos();
        }
    }, [blogTemplate, fetchRepos]);

    // ... (기존 handleRepoSelect, handleThemeChange, fontOptions 코드는 동일)
    const handleRepoSelect = (e) => {
        const selectedFullName = e.target.value;
        if (!selectedFullName) return;
        setRepositoryName(selectedFullName);
        const selectedRepo = repos.find(r => r.full_name === selectedFullName);
        if (selectedRepo) {
            if (!blogTitle) setBlogTitle(selectedRepo.name);
            if (!blogDescription && selectedRepo.description) {
                setBlogDescription(selectedRepo.description);
            }
        }
    };

    const handleThemeChange = (key, value) => {
        setCustomTheme(prev => ({ ...prev, [key]: value }));
    };

    const handleColorClick = (key) => {
        setPickingColorKey(key);
        hiddenColorInputRef.current?.click();
    };

    const handleHiddenColorChange = (e) => {
        if (pickingColorKey) {
            handleThemeChange(pickingColorKey, e.target.value);
        }
    };

    const fontOptions = [
        { label: "Noto Sans KR (Standard)", family: "'Noto Sans KR', sans-serif", url: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" },
        { label: "Nanum Gothic (Friendly)", family: "'Nanum Gothic', sans-serif", url: "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap" },
        { label: "Nanum Myeongjo (Classic)", family: "'Nanum Myeongjo', serif", url: "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap" },
    ];

    // [New] 드래그 앤 드롭 핸들러
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const { notify } = useNotificationStore();

    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // 주의: Base64 스트링을 avatarUrl에 저장합니다.
                // 백엔드 deploy_service.py의 requests.get은 Base64를 직접 처리하지 못하므로,
                // 실제 서비스에서는 여기서 S3 업로드를 수행하고 URL을 받아와야 합니다.
                // 현재는 Preview 목적(Data URL)으로 설정합니다.
                setAvatarUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            notify("이미지 파일만 업로드 가능합니다.", "error");
        }
    };

    return (
        <div className="relative w-96 bg-white border-r border-gray-200 h-full flex flex-col font-sans shadow-xl z-20 overflow-y-auto scrollbar-hide blog-settings-container">
            {/* Header */}
            <FloatingBackButton className="!absolute !top-5 !right-5 !left-auto !p-2 !h-auto !w-auto border-none shadow-none bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-900" />
            <div className="px-6 py-5 border-b border-gray-100 bg-white pr-20">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">블로그 설정</h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">블로그의 기본 설정을 구성하세요</p>
            </div>


            {/* 1. Template Selection (기존 동일) */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 template-selector">
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                    🛠 Blog Template
                </h3>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                        템플릿 선택
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        <label className={`relative flex items-center gap-4 cursor-pointer p-3 rounded-xl border-2 transition-all group ${blogTemplate === 'tech' ? 'bg-blue-50/50 border-blue-500 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300'}`}>
                            <input type="radio" name="template" value="tech" checked={blogTemplate === 'tech'} onChange={(e) => setBlogTemplate(e.target.value)} className="hidden" />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${blogTemplate === 'tech' ? 'border-blue-500' : 'border-gray-300'}`}>
                                {blogTemplate === 'tech' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <div className="flex-1">
                                <span className={`text-sm font-bold block ${blogTemplate === 'tech' ? 'text-blue-700' : 'text-gray-700'}`}>Tech Blog (기술 블로그)</span>
                                <span className="text-[10px] text-gray-400 font-medium">Chirpy 테마 • GitHub Pages</span>
                            </div>
                            <div className="absolute right-3 top-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                <ImageIcon size={32} className={blogTemplate === 'tech' ? "text-blue-500" : "text-gray-300"} />
                            </div>
                        </label>

                        <label className={`relative flex items-center gap-4 cursor-pointer p-3 rounded-xl border-2 transition-all group ${blogTemplate === 'docs' ? 'bg-purple-50/50 border-purple-500 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300'}`}>
                            <input type="radio" name="template" value="docs" checked={blogTemplate === 'docs'} onChange={(e) => { setBlogTemplate(e.target.value); setRepositoryName(""); }} className="hidden" />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${blogTemplate === 'docs' ? 'border-purple-500' : 'border-gray-300'}`}>
                                {blogTemplate === 'docs' && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                            </div>
                            <div className="flex-1">
                                <span className={`text-sm font-bold block ${blogTemplate === 'docs' ? 'text-purple-700' : 'text-gray-700'}`}>Docs Site (문서 사이트)</span>
                                <span className="text-[10px] text-gray-400 font-medium">Just-the-Docs • 지식 베이스</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* 2. Basic Information */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                        기본 정보 (Basic Info)
                    </label>

                    {blogTemplate === 'docs' ? (
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 ml-1">연동할 저장소 (Repository)</label>
                            <div className="relative">
                                <select onChange={handleRepoSelect} value={repositoryName} className="w-full pl-3 pr-8 py-2.5 text-xs font-bold border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all appearance-none">
                                    <option value="" disabled>{isRepoLoading ? "로딩 중..." : "저장소 선택..."}</option>
                                    {!isRepoLoading && repos.map((repo) => (<option key={repo.id} value={repo.full_name}>{repo.name}</option>))}
                                </select>
                                <button onClick={() => fetchRepos()} className="absolute right-2 top-2 text-gray-400 hover:text-blue-500 bg-white p-0.5 rounded" disabled={isRepoLoading}><RefreshCw size={14} className={isRepoLoading ? "animate-spin" : ""} /></button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-sm mb-4">🔗 {username}.github.io <span className="text-xs ml-2 text-blue-500">(Auto-generated)</span></div>
                    )}

                    {/* 기본 정보 입력 필드 (기존 동일) */}
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Project Name <span className="text-red-500">*</span></label>
                        <input type="text" name="blog_title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>

                    {blogTemplate === 'tech' && (
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 ml-1">슬로건 (Tagline)</label>
                            <input type="text" value={blogTagline} onChange={(e) => setBlogTagline(e.target.value)} placeholder="블로그를 한마디로 표현해보세요" className="w-full px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 ml-1">설명 (Description)</label>
                        <textarea value={blogDescription} onChange={(e) => setBlogDescription(e.target.value)} rows={2} placeholder="이 블로그는 어떤 주제인가요?" className="w-full px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
                    </div>

                    {/* Theme Customization (기존 동일) */}
                    <div className="border-t border-gray-100 mt-4 pt-4 theme-color-picker">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Palette size={16} /> Theme Customization
                        </h4>

                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Font Style</label>
                            <select
                                className="w-full px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-500 appearance-none"
                                value={customTheme.font_family_base}
                                onChange={(e) => {
                                    const selected = fontOptions.find(f => f.family === e.target.value);
                                    if (selected) { handleThemeChange('font_family_base', selected.family); handleThemeChange('font_import_url', selected.url); }
                                }}
                            >
                                {fontOptions.map((f, i) => (<option key={i} value={f.family}>{f.label}</option>))}
                            </select>
                            <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400"><Palette size={14} /></div>
                        </div>
                    </div>

                    {/* Compact Color Grid */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 ml-1">색상 팔레트 (Color Palette)</label>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            {blogTemplate === 'docs' ? (
                                <div className="space-y-3">
                                    <ColorRow label="사이드바" value={customTheme.sidebar_bg} onClick={() => handleColorClick('sidebar_bg')} />
                                    <ColorRow label="메인 배경" value={customTheme.main_bg} onClick={() => handleColorClick('main_bg')} />
                                    <ColorRow label="강조 색상" value={customTheme.active_color} onClick={() => handleColorClick('active_color')} />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <ColorRow label="메인 배경" value={customTheme.main_bg} onClick={() => handleColorClick('main_bg')} />
                                    <ColorRow label="사이드바" value={customTheme.sidebar_bg} onClick={() => handleColorClick('sidebar_bg')} />
                                    <ColorRow label="텍스트" value={customTheme.sidebar_text} onClick={() => handleColorClick('sidebar_text')} />
                                    <ColorRow label="강조 색상" value={customTheme.active_color} onClick={() => handleColorClick('active_color')} />
                                    <ColorRow label="카드 배경" value={customTheme.card_bg} onClick={() => handleColorClick('card_bg')} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. Author (Tech Only) */}
                {blogTemplate === 'tech' && (
                    <>
                        <div className="border-t border-gray-100"></div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">작성자 프로필 (Profile)</label>

                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="표시 이름 (닉네임)" className="w-full px-3 py-2.5 text-xs font-bold border border-gray-200 rounded-lg focus:border-blue-500 outline-none" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소" className="w-full px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg focus:border-blue-500 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                                        relative w-full h-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all gap-3 overflow-hidden group
                                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50'}
                                        ${avatarUrl ? 'bg-white' : ''}
                                    `}
                                >
                                    <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="image/*" className="hidden" />

                                    {avatarUrl ? (
                                        <>
                                            <img src={avatarUrl} alt="Preview" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-xs font-bold drop-shadow-md">이미지 변경</span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setAvatarUrl(""); }}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-gray-500 hover:text-red-500 shadow-sm backdrop-blur"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <UploadCloud className={`w-6 h-6 mb-1 ${isDragging ? 'text-blue-500' : 'text-gray-300'}`} />
                                            <span className="text-[10px] font-bold text-gray-400">클릭 또는 드래그하여 업로드</span>
                                        </div>
                                    )}
                                </div>
                                {!avatarUrl && <p className="text-[9px] text-gray-400 ml-1 text-center">선택사항 - 비워두면 GitHub 프로필 사용</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">ℹ️</span>
                    <p className="text-[10px] text-gray-600 font-medium leading-tight">
                        블로그 생성 및 포스팅 완료 시, <strong>GitHub Pages 빌드까지 수분(최대 5분) 소요</strong>될 수 있습니다.
                        반영이 안 되면 잠시 후 다시 확인해주세요.
                    </p>
                </div>
                <div className="mt-8 create-blog-button-container">
                    <button
                        onClick={onDeploy}
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all create-blog-button ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                        {isLoading ? 'Creating...' : '🚀 Create Blog'}
                    </button>
                </div>
            </div>
            {/* Hidden Color Input (Positioned at bottom-left to force popup location) */}
            <input
                type="color"
                ref={hiddenColorInputRef}
                className="fixed bottom-10 left-10 w-0 h-0 opacity-0 pointer-events-none"
                value={pickingColorKey ? customTheme[pickingColorKey] : "#000000"}
                onChange={handleHiddenColorChange}
            />
        </div>
    );
}

// Helper Component for Color Row (Simplified)
const ColorRow = ({ label, value, onClick }) => (
    <div className="flex items-center justify-between group cursor-pointer" onClick={onClick}>

        <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-gray-400 uppercase hidden group-hover:inline-block transition-opacity opacity-0 group-hover:opacity-100">{value}</span>
            <div className="relative w-8 h-5 rounded-md overflow-hidden ring-1 ring-gray-200 shadow-sm hover:ring-2 hover:ring-blue-100 transition-all">
                <div className="w-full h-full" style={{ backgroundColor: value }}></div>
            </div>
        </div>
    </div>
);