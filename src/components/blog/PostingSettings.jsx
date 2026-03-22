import {
    GitBranch, Book, RefreshCw, PenTool, FileText, Sparkles, UploadCloud,
    Tag, Search, ArrowUp, ArrowDown, Save, X, List,
    ChevronRight, ChevronDown, Plus, Folder, Check,
    Image as ImageIcon, Hash, Pin, Loader2, RotateCcw,
    FolderPlus, FolderOpen, Home, Github, Globe, Layout, RefreshCcw, Settings, Upload
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../../store/useNotificationStore";

// ============================================================================
// [Sub-Component] Source Tree Selector (Docs 모드용 - 기능 복원됨)
// AI가 추천한 파일 목록을 트리 구조로 보여주고 체크박스로 선택하는 핵심 컴포넌트
// ============================================================================
const SourceTreeSelector = ({ sourceFiles, selectedFiles, onToggle }) => {
    const tree = useMemo(() => {
        if (!sourceFiles) return {};
        const root = {};
        sourceFiles.forEach(file => {
            // 파일 경로 문자열을 '/' 기준으로 쪼개서 트리 객체 생성
            const parts = file.path.split('/');
            let current = root;
            parts.forEach((part, idx) => {
                if (!current[part]) {
                    current[part] = {
                        name: part,
                        path: parts.slice(0, idx + 1).join('/'),
                        children: {},
                        isFile: idx === parts.length - 1,
                        recommended: file.recommended,
                        score: file.score
                    };
                }
                current = current[part].children;
            });
        });
        return root;
    }, [sourceFiles]);

    const renderNode = (nodes, depth = 0) => {
        return Object.values(nodes).map(node => {
            const isSelected = selectedFiles.includes(node.path);
            return (
                <div key={node.path} className="select-none">
                    <div className={`flex items-center gap-2 py-1 px-2 rounded transition-colors ${depth > 0 ? 'ml-3' : ''} ${isSelected ? 'bg-purple-100/70' : 'hover:bg-purple-50'}`}>
                        {node.isFile ? (
                            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onToggle(node.path)}
                                    className="w-3 h-3 accent-purple-600 rounded cursor-pointer"
                                />
                                <FileText size={12} className={node.recommended ? "text-purple-600" : "text-gray-400"} />
                                <span className={`text-[11px] truncate ${node.recommended ? 'font-bold text-purple-700' : 'text-gray-600'}`}>
                                    {node.name}
                                </span>
                                {node.recommended && ( // AI 추천 배지
                                    <span className="text-[8px] bg-purple-600 text-white px-1.5 rounded-full flex items-center gap-0.5 ml-auto flex-shrink-0 shadow-sm">
                                        <Check size={8} strokeWidth={4} /> AI Pick
                                    </span>
                                )}
                            </label>
                        ) : (
                            <div className="flex items-center gap-1 text-gray-400">
                                <Folder size={12} className="fill-gray-100" />
                                <span className="text-[11px] font-bold text-gray-500">{node.name}</span>
                            </div>
                        )}
                    </div>
                    {!node.isFile && <div className="border-l border-gray-100 ml-2">{renderNode(node.children, depth + 1)}</div>}
                </div>
            );
        });
    };

    return (
        <div className="border-2 border-purple-100 rounded-lg max-h-64 overflow-y-auto bg-white p-2 custom-scrollbar shadow-inner mt-2">
            {sourceFiles && sourceFiles.length > 0 ? renderNode(tree) : (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                    AI 분석 결과가 여기에 표시됩니다.
                </div>
            )}
        </div>
    );
};

// ============================================================================
// [Utility] Tree Builder (게시글 목록용)
// ============================================================================
const buildTreeWithDraft = (posts, draftInfo = null) => {
    if (!posts) return { home: null, folders: [], files: [] };

    const root = { home: null, folders: [], files: [] };
    const folderMap = {};
    const normalize = (name) => name ? String(name).trim() : "";

    const getOrCreateFolder = (pathStr) => {
        const parts = pathStr.split('/').map(normalize).filter(Boolean);
        let currentLevel = root.folders;
        let currentPath = "";
        let folderNode = null;

        parts.forEach((part) => {
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            if (!folderMap[currentPath]) {
                const newFolder = {
                    title: part,
                    path: `__virtual__/${currentPath}`,
                    category: currentPath,
                    type: 'folder',
                    children: [],
                    is_virtual: true,
                    nav_order: 999
                };
                folderMap[currentPath] = newFolder;
                currentLevel.push(newFolder);
            }
            folderNode = folderMap[currentPath];
            currentLevel = folderNode.children;
        });
        return folderNode;
    };

    posts.forEach(p => {
        if (p.path === 'index.md' || p.path === 'README.md') { root.home = p; return; }

        const isFolderIndex = p.is_index || p.path.endsWith('/index.md');
        if (isFolderIndex && p.category && p.category !== 'Home') {
            const folderNode = getOrCreateFolder(p.category);
            if (folderNode) {
                folderNode.is_virtual = false;
                Object.assign(folderNode, p);
                folderNode.path = p.path;
                folderNode.type = 'folder';
            }
        }
    });

    posts.forEach(p => {
        if (p.path === 'index.md' || p.path === 'README.md' || (p.is_index && p.category !== 'Home')) return;

        const node = { ...p, type: 'file' };
        if (!p.category || p.category === 'Home' || p.category === 'Uncategorized') {
            root.files.push(node);
        } else {
            const targetFolder = getOrCreateFolder(p.category);
            targetFolder.children.push(node);
        }
    });

    if (draftInfo && draftInfo.mode === 'create' && draftInfo.title) {
        const draftPath = draftInfo.category
            ? `${draftInfo.category}/${draftInfo.title}.md`
            : `${draftInfo.title}.md`;

        const draftNode = {
            title: draftInfo.title,
            path: draftPath,
            category: draftInfo.category,
            type: 'file',
            isDraft: true,
            nav_order: -1
        };

        if (!draftInfo.category || draftInfo.category === 'Home' || draftInfo.category === 'Uncategorized') {
            root.files.push(draftNode);
        } else {
            const targetFolder = getOrCreateFolder(draftInfo.category);
            targetFolder.children.push(draftNode);
        }
    }

    const sortNodes = (nodes) => {
        nodes.sort((a, b) => (a.nav_order ?? 999) - (b.nav_order ?? 999) || (a.title || "").localeCompare(b.title || ""));
        nodes.forEach(node => { if (node.children?.length) sortNodes(node.children); });
    };
    sortNodes(root.folders);
    sortNodes(root.files);

    return root;
};

// ============================================================================
// [Shared] Docs Tree Node Component (기존 포스트 목록 표시용)
// ============================================================================
const DocsTreeNode = ({ node, isReordering, onSelect, onMove, activePath, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isFolder = node.type === 'folder';
    const paddingLeft = `${level * 12 + 8}px`;
    const isSelected = activePath === node.path;
    const isDraft = node.isDraft;

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        if (node.path.startsWith('__virtual__')) {
            if (isFolder) setIsOpen(!isOpen);
            return;
        }
        onSelect(node);
        if (isFolder && !isOpen) setIsOpen(true);
    };

    return (
        <div>
            <div
                onClick={handleSelect}
                className={`flex items-center gap-2 py-2 px-3 my-0.5 rounded-lg cursor-pointer transition-all border
                    ${isSelected
                        ? 'bg-purple-600 border-purple-700 text-white shadow-md z-10 scale-[1.02] font-bold'
                        : isDraft ? 'bg-purple-50 border-purple-200 text-purple-600 border-dashed' : 'border-transparent hover:bg-gray-100 text-gray-700'}
                    ${isReordering ? 'opacity-80 cursor-move' : ''}
                `}
                style={{ paddingLeft }}
            >
                <div className="flex-shrink-0 w-4 flex justify-center">
                    {isReordering ? (
                        <div className="flex flex-col -space-y-1 text-gray-400">
                            <button onClick={(e) => { e.stopPropagation(); onMove(node, -1); }} className="hover:text-purple-600 p-0.5"><ArrowUp size={8} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onMove(node, 1); }} className="hover:text-purple-600 p-0.5"><ArrowDown size={8} /></button>
                        </div>
                    ) : (
                        <div
                            className={isSelected ? 'text-white' : (isDraft ? 'text-purple-400' : 'text-gray-400')}
                            onClick={isFolder ? handleToggle : undefined}
                        >
                            {isFolder ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <FileText size={14} />}
                        </div>
                    )}
                </div>
                <span className="text-sm truncate flex-1 flex items-center gap-2">
                    {node.title}
                    {isDraft && <span className="text-[9px] bg-purple-100 text-purple-600 px-1 rounded">New</span>}
                </span>
            </div>
            {isFolder && isOpen && (
                <div className="border-l-2 border-gray-100 ml-4 animate-fade-in">
                    {node.children.map(child => <DocsTreeNode key={child.path} node={child} isReordering={isReordering} onSelect={onSelect} onMove={onMove} activePath={activePath} level={level + 1} />)}
                </div>
            )}
        </div>
    );
};

// ============================================================================
// [Loading Overlay]
// ============================================================================
const TabLoadingOverlay = ({ message, onMinimize }) => (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in p-6">
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-200 to-purple-200 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-white p-5 rounded-full shadow-xl border border-gray-100">
                <Loader2 className="w-10 h-10 text-gray-800 animate-spin" />
            </div>
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-2 tracking-tight">AI 작업 진행 중</h3>
        <p className="text-gray-500 text-sm mb-8 text-center leading-relaxed whitespace-pre-wrap max-w-[260px]">{message}</p>

        <button
            onClick={onMinimize}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 hover:scale-105 active:scale-95"
        >
            <span>백그라운드에서 계속하기</span>
        </button>
    </div>
);

// ============================================================================
// [Docs Settings]
// ============================================================================
const DocsSettings = ({
    data, setData,
    blogList, posts, categories, onGenerate, onUpload, isLoading, onSelectPost, onAddImage,
    isProcessing, currentTaskType, onClose, docsSourceFiles, onRestoreAI, hasDocsScanHistory,
    onSaveWorkspace, onRestoreUserWorkspace, hasUserWorkspace
}) => {
    const { notify } = useNotificationStore();
    const [panelState, setPanelState] = useState('idle');
    const [docsTree, setDocsTree] = useState({ home: null, folders: [], files: [] });
    const [isReordering, setIsReordering] = useState(false);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);



    const currentActivePath = data.mode === 'update'
        ? data.activeDocPath
        : (data.postTitle ? `${data.category ? data.category + '/' : ''}${data.postTitle}.md` : null);

    useEffect(() => {
        if (posts) {
            const tree = buildTreeWithDraft(posts, {
                mode: data.mode,
                title: data.postTitle,
                category: data.category
            });
            setDocsTree(tree);
        }
    }, [posts, data.mode, data.postTitle, data.category]);

    useEffect(() => {
        if (docsSourceFiles && docsSourceFiles.length > 0) {
            setPanelState('scan');
            if (!data.selectedRefs || data.selectedRefs.length === 0) {
                // 추천 파일 자동 선택 (recommended 속성 기반)
                const aiPicks = docsSourceFiles.filter(f => f.recommended).map(f => f.path);
                setData({ selectedRefs: aiPicks });
            }
        }
    }, [docsSourceFiles]);

    const handleBlogChange = (e) => {
        const blog = blogList.find(b => b.repo_name === e.target.value);
        setData({ selectedBlog: blog });
    };

    const handleSelectDoc = (node) => {
        if (!node.isDraft) {
            onSelectPost(node);
            setPanelState('idle');
            setData({ selectedRefs: [] });
        }
    };

    // [FIX] 스캔 요청 시에도 Context 제공
    const handleScan = () => {
        if (!data.postTitle) return notify("문서 제목을 입력해주세요.", "error");
        if (!data.selectedBlog) return notify("블로그를 선택해주세요.", "error");

        // 부모 컴포넌트의 handleGenerateRequest(onGenerate)를 호출
        // payload에 필요한 정보들을 담아 보냄
        onGenerate({
            type: 'docs_recommend',
            doc_title: data.postTitle,
            doc_path: data.activeDocPath
            // doc_context는 부모에서 합쳐서 보내거나 여기서 보내야 함.
            // 여기서는 onGenerate 호출 시 부모(Page)가 doc_context를 합칠 수 있도록 설계됨.
        });
    };

    const handleSourceToggle = (path) => {
        const prevRefs = data.selectedRefs || [];
        let nextRefs;
        if (prevRefs.includes(path)) {
            nextRefs = prevRefs.filter(p => p !== path);
        } else {
            if (prevRefs.length >= 10) return notify("최대 10개까지 선택 가능합니다.", "error");
            nextRefs = [...prevRefs, path];
        }
        setData({ selectedRefs: nextRefs });
    };

    const handleGenerate = () => {
        if (!data.selectedRefs || data.selectedRefs.length === 0) return notify("참고할 파일을 최소 1개 이상 선택해주세요.", "error");
        onGenerate({
            type: 'docs_copilot',
            reference_files: data.selectedRefs,
            user_prompt: data.userPrompt
        });
    };

    const handleCategoryChange = (e) => {
        if (e.target.value === '__new__') {
            setIsCustomCategory(true); setNewCategory("");
            setData({ category: "" });
        } else {
            setIsCustomCategory(false);
            setData({ category: e.target.value });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* [Removed] TabLoadingOverlay */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-700 flex items-center gap-1"><Book size={14} /> Docs Site</span>
                    <div className="flex items-center gap-1">
                        <HomeButton />
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" title="탭 닫기"><X size={16} /></button>
                    </div>
                </div>
                <select
                    value={data.selectedBlog?.repo_name || ""}
                    onChange={handleBlogChange}
                    className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none"
                >
                    <option value="">저장소 선택...</option>
                    {blogList.filter(b => b.theme_type === 'docs').map(b => <option key={b.repo_name} value={b.repo_name}>{b.blog_title}</option>)}
                </select>
            </div>

            {/* [Workspace Toolbar] */}
            <div className="px-4 py-2 border-b bg-gray-50 flex gap-2">
                <button
                    onClick={onSaveWorkspace}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    title="현재 작업 상태를 임시 저장합니다"
                >
                    <Save size={13} /> 임시 저장
                </button>
                <button
                    onClick={onRestoreUserWorkspace}
                    disabled={!hasUserWorkspace}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium transition-colors ${hasUserWorkspace ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 cursor-not-allowed'}`}
                    title="마지막으로 저장된 상태를 불러옵니다"
                >
                    <RotateCcw size={13} /> 저장 복구
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {data.selectedBlog && (
                    <>
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm mb-4">
                            {panelState === 'create' ? (
                                <div className="space-y-3 animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-purple-700">새 문서</span>
                                        <X size={14} className="cursor-pointer" onClick={() => setPanelState('idle')} />
                                    </div>
                                    <div className="flex gap-2">
                                        <select value={isCustomCategory ? '__new__' : data.category} onChange={handleCategoryChange} className="flex-1 p-2 border rounded text-xs">
                                            <option value="">(최상위)</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            <option value="__new__">+ 새 폴더</option>
                                        </select>
                                        {isCustomCategory && <input type="text" placeholder="폴더 이름" className="flex-1 p-2 border rounded text-xs" onChange={(e) => setNewCategory(e.target.value)} onBlur={() => setData(prev => ({ ...prev, category: newCategory }))} />}
                                    </div>
                                    <input
                                        type="text"
                                        value={data.postTitle}
                                        onChange={(e) => setData(prev => ({ ...prev, postTitle: e.target.value }))}
                                        placeholder="문서 제목"
                                        className="w-full p-2 border rounded text-xs"
                                    />
                                    <button onClick={handleScan} className="w-full py-2 bg-purple-600 text-white rounded text-xs font-bold shadow-sm hover:bg-purple-700">분석 시작</button>
                                </div>
                            ) : panelState === 'scan' ? (
                                <div className="space-y-3 animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-purple-700">추천 소스</span>
                                        <X size={14} className="cursor-pointer" onClick={() => setPanelState('idle')} />
                                    </div>
                                    <SourceTreeSelector
                                        sourceFiles={docsSourceFiles}
                                        selectedFiles={data.selectedRefs || []}
                                        onToggle={handleSourceToggle}
                                    />
                                    <textarea
                                        value={data.userPrompt}
                                        onChange={(e) => setData(prev => ({ ...prev, userPrompt: e.target.value }))}
                                        placeholder="추가 요청사항..."
                                        className="w-full p-2 border rounded text-xs min-h-[50px] outline-none bg-white"
                                    />
                                    <button onClick={handleGenerate} disabled={isProcessing} className="w-full py-2 bg-purple-600 text-white rounded text-xs font-bold shadow-sm hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                                        {isProcessing ? '작업이 진행 중입니다...' : '생성하기'}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <button onClick={() => { setPanelState('create'); setData(prev => ({ ...prev, mode: 'create', postTitle: "", activeDocPath: null })); }} className="flex-1 py-3 bg-white border border-purple-200 text-purple-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-purple-100">
                                            <Plus size={16} /> 새 문서
                                        </button>
                                        {data.mode === 'update' && data.activeDocPath && (
                                            <button onClick={handleScan} disabled={isProcessing} className="flex-1 py-3 bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-purple-700 transition-all animate-pulse-subtle disabled:bg-gray-300 disabled:animate-none">
                                                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                                {isProcessing ? '분석 중...' : 'AI 스캔'}
                                            </button>
                                        )}
                                    </div>
                                    {hasDocsScanHistory && (
                                        <button onClick={onRestoreAI} className="w-full py-2 bg-purple-50 border border-purple-200 text-purple-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-purple-100 transition-all">
                                            <RotateCcw size={12} /> 이전 AI 분석 복원
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">기존 포스트 목록</div>
                            {docsTree.home && <DocsTreeNode node={docsTree.home} onSelect={handleSelectDoc} activePath={currentActivePath} />}
                            {docsTree.folders.map(f => <DocsTreeNode key={f.path} node={f} isReordering={isReordering} onSelect={handleSelectDoc} onMove={() => { }} activePath={currentActivePath} />)}
                            {docsTree.files.map(f => <DocsTreeNode key={f.path} node={f} isReordering={isReordering} onSelect={handleSelectDoc} onMove={() => { }} activePath={currentActivePath} />)}
                        </div>
                    </>
                )}
            </div>
            <div className="p-4 border-t bg-gray-50">
                <button onClick={onUpload} disabled={isLoading || !data.selectedBlog} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black disabled:bg-gray-300 save-post-button">
                    {data.mode === 'create' ? '발행하기' : '저장하기'}
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// [Tech Settings] Tech 모드 전용 설정 패널
// ============================================================================
const TechSettings = ({
    data, setData,
    blogList, sourceRepos, categories, posts, onGenerate, onUpload, isLoading, onSelectPost, onAddImage, isProcessing, currentTaskType, onClose,
    onSaveWorkspace, onRestoreUserWorkspace, hasUserWorkspace
}) => {
    const [techTree, setTechTree] = useState({ home: null, folders: [], files: [] });
    // [Fix] 로컬 state 제거 -> data props 사용 (동기화 보장)
    // const [imageInfo, setImageInfo] = useState({path: "", alt: "" });
    // const [options, setOptions] = useState({math: false, mermaid: false, pin: false });

    // [카테고리 트리 생성]
    const categoryTree = useMemo(() => {
        const tree = {};
        if (categories && Array.isArray(categories)) {
            categories.forEach(cat => {
                if (!cat) return;
                const parts = cat.split('/');
                const main = parts[0];
                const sub = parts[1] || null;

                if (!tree[main]) tree[main] = [];
                if (sub && !tree[main].includes(sub)) {
                    tree[main].push(sub);
                }
            });
        }
        return tree;
    }, [categories]);

    // [로컬 상태]
    const [mainInput, setMainInput] = useState("");
    const [subInput, setSubInput] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);

    // [Effect] 부모 데이터 로드 시 로컬 상태 초기화
    useEffect(() => {
        const currentCombined = mainInput + (subInput ? `/${subInput}` : "");
        if (data.category && data.category !== currentCombined) {
            const parts = data.category.split('/');
            setMainInput(parts[0] || "");
            setSubInput(parts[1] || "");
        } else if (!data.category && !mainInput) {
            setMainInput("");
            setSubInput("");
        }
    }, [data.category]);

    // [Handlers]
    const handleMainChange = (e) => {
        const val = e.target.value;
        setMainInput(val);
        setSubInput("");
        setData(prev => ({ ...prev, category: val }));
    };

    const handleSubChange = (e) => {
        const val = e.target.value;
        setSubInput(val);
        const full = mainInput ? (val ? `${mainInput}/${val}` : mainInput) : val;
        setData(prev => ({ ...prev, category: full }));
    };




    useEffect(() => {
        if (posts) {
            const tree = buildTreeWithDraft(posts, null);
            setTechTree(tree);
        }
    }, [posts]);

    const handleBlogChange = (e) => {
        const repoName = e.target.value;
        const blog = blogList.find(b => b.repo_name === repoName);
        setData(prev => ({ ...prev, selectedBlog: blog }));
    };

    const toggleOption = (key) => {
        setData(prev => ({
            ...prev,
            options: { ...(prev.options || {}), [key]: !(prev.options?.[key]) }
        }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file && onAddImage) {
            const blobUrl = onAddImage(file);
            setData(prev => ({
                ...prev,
                imageInfo: { path: blobUrl, alt: file.name }
            }));
        }
    };

    const handleCreateDraft = () => {
        onGenerate({ type: 'tech_blog' });
    };

    const handleSelectDoc = (node) => {
        onSelectPost(node);
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* [Removed] TabLoadingOverlay */}

            <div className="p-4 border-b space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal-700 flex items-center gap-1"><GitBranch size={14} /> TECH BLOG</span>
                    <div className="flex items-center gap-1">
                        <HomeButton />
                        <button onClick={onClose} title="탭 닫기"><X size={16} /></button>
                    </div>
                </div>
                <select
                    value={data.selectedBlog?.repo_name || ""}
                    onChange={handleBlogChange}
                    className="w-full p-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-100"
                >
                    <option value="">블로그 선택...</option>
                    {blogList.filter(b => b.theme_type !== 'docs').map((blog) => (<option key={blog.repo_name} value={blog.repo_name}>{blog.blog_title}</option>))}
                </select>

                {data.selectedBlog && (
                    <div className="flex bg-teal-50 rounded-lg p-1 border border-teal-100 mt-2">
                        <button onClick={() => setData(prev => ({ ...prev, mode: 'create', postTitle: "" }))} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${data.mode === 'create' ? 'bg-white text-teal-600 shadow-sm' : 'text-teal-400 hover:text-teal-600'}`}>새 글 작성</button>
                        <button onClick={() => setData(prev => ({ ...prev, mode: 'update' }))} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${data.mode === 'update' ? 'bg-white text-teal-600 shadow-sm' : 'text-teal-400 hover:text-teal-600'}`}>기존 글 수정</button>
                    </div>
                )}
            </div>

            {/* [Workspace Toolbar] */}
            <div className="px-4 py-2 border-b bg-gray-50 flex gap-2">
                <button
                    onClick={onSaveWorkspace}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    title="현재 작업 상태를 임시 저장합니다"
                >
                    <Save size={13} /> 임시 저장
                </button>
                <button
                    onClick={onRestoreUserWorkspace}
                    disabled={!hasUserWorkspace}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium transition-colors ${hasUserWorkspace ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 cursor-not-allowed'}`}
                    title="마지막으로 저장된 상태를 불러옵니다"
                >
                    <RotateCcw size={13} /> 저장 복구
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                {data.mode === 'create' ? (
                    <div className="space-y-5 animate-fade-in">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"><PenTool size={12} /> 포스트 설정</h4>
                            <input
                                type="text"
                                value={data.postTitle}
                                onChange={(e) => setData(prev => ({ ...prev, postTitle: e.target.value }))}
                                placeholder="제목을 입력하세요"
                                className="w-full p-2.5 border rounded-lg text-sm font-medium outline-none focus:border-teal-500 transition-colors"
                            />

                            {/* [Fix] Category UI: 상위/하위 분리 및 입력 지원 */}
                            <div className="flex gap-2">
                                {/* Main Category */}
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        list="main-cat-options"
                                        value={mainInput}
                                        onChange={handleMainChange}
                                        placeholder="상위 카테고리"
                                        className="w-full p-2 border rounded-lg text-xs bg-white outline-none focus:border-teal-500 pr-6"
                                    />
                                    <datalist id="main-cat-options">
                                        {Object.keys(categoryTree).map(cat => <option key={cat} value={cat} />)}
                                    </datalist>
                                    <FolderOpen size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Sub Category */}
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        list="sub-cat-options"
                                        value={subInput}
                                        onChange={handleSubChange}
                                        placeholder="하위 카테고리"
                                        className="w-full p-2 border rounded-lg text-xs bg-white outline-none focus:border-teal-500 pr-6"
                                        disabled={!mainInput}
                                    />
                                    <datalist id="sub-cat-options">
                                        {categoryTree[mainInput]?.map(sub => <option key={sub} value={sub} />)}
                                    </datalist>
                                    <FolderPlus size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="relative">
                                <Hash size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                <input type="text" value={data.tags} onChange={(e) => setData(prev => ({ ...prev, tags: e.target.value }))} placeholder="태그 (쉼표 구분)" className="w-full pl-8 p-2 border rounded-lg text-xs outline-none focus:border-teal-500" />
                            </div>
                        </div>

                        {/* 옵션 및 썸네일 */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">옵션 (Options)</h4>
                            <div className="flex gap-2">
                                {[{ key: 'math', label: '수식(Math)' }, { key: 'mermaid', label: '차트(Mermaid)' }, { key: 'pin', label: '상단 고정', icon: Pin }].map((opt) => {
                                    const isActive = data.options?.[opt.key];
                                    return (
                                        <button key={opt.key} onClick={() => toggleOption(opt.key)} className={`flex-1 py-2 px-1 rounded-lg text-[10px] font-bold border transition-all flex flex-col items-center gap-1 ${isActive ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                            {opt.icon && <opt.icon size={10} className={isActive ? "fill-teal-600" : ""} />}
                                            {opt.label}
                                            <div className={`w-6 h-3 rounded-full relative transition-colors ${isActive ? 'bg-teal-500' : 'bg-gray-200'}`}><div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-transform ${isActive ? 'left-3.5' : 'left-0.5'}`} /></div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"><ImageIcon size={12} /> 썸네일 (Thumbnail)</h4>
                            <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-3 hover:bg-gray-50 hover:border-teal-300 transition-all cursor-pointer group">
                                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                {data.imageInfo?.path ? (<div className="relative"><img src={data.imageInfo.path} alt="Thumbnail" className="w-full h-24 object-cover rounded-md shadow-sm" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md"><p className="text-white text-xs font-bold">이미지 변경</p></div></div>) : (<div className="text-center py-4"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400 group-hover:text-teal-500 group-hover:bg-teal-50 transition-colors"><UploadCloud size={16} /></div><p className="text-[10px] text-gray-400">클릭하여 대표 이미지 업로드</p></div>)}
                            </label>
                        </div>

                        <div className="border-t border-dashed border-gray-200 my-2"></div>

                        <Section title="AI 초안 생성 (선택)" icon={Sparkles} color="text-purple-600">
                            <div className="bg-purple-50 p-3 rounded-xl space-y-2 border border-purple-100">
                                <select
                                    value={data.targetRepo || ""}
                                    onChange={(e) => setData(prev => ({ ...prev, targetRepo: e.target.value }))}
                                    className="w-full p-2 border rounded-lg text-xs bg-white"
                                >
                                    <option value="">소스 코드 저장소 선택...</option>
                                    {sourceRepos.map(r => <option key={r.id} value={r.full_name}>{r.name}</option>)}
                                </select>
                                <button
                                    onClick={handleCreateDraft}
                                    disabled={!data.targetRepo || isProcessing}
                                    className="w-full py-2 bg-purple-600 text-white rounded-lg text-xs font-bold shadow hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    {isProcessing ? 'AI 작업 중...' : '개발 활동으로 초안 만들기'}
                                </button>
                            </div>
                        </Section>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">기존 포스트 목록</div>
                        {techTree.folders.map(f => <DocsTreeNode key={f.path} node={f} onSelect={handleSelectDoc} isSelected={false} />)}
                        {techTree.files.map(f => <DocsTreeNode key={f.path} node={f} onSelect={handleSelectDoc} isSelected={false} />)}
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-gray-50">
                <button onClick={onUpload} disabled={isLoading || !data.selectedBlog} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black disabled:bg-gray-300 save-post-button">
                    {data.mode === 'create' ? '발행하기' : '저장하기'}
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// [Main] PostingSettings
// ============================================================================
export default function PostingSettings(props) {
    const { activeTab, setActiveTab, isProcessing, currentTaskType, docsSourceFiles } = props;

    if (!activeTab) {
        return (
            <div className="w-80 bg-white border-r flex flex-col h-full font-sans animate-fade-in">
                <div className="p-8 space-y-8 flex-1 flex flex-col justify-center">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black text-gray-900">블로그 타입 선택</h2>
                        <p className="text-xs text-gray-400">작성할 문서의 종류를 선택해주세요</p>
                    </div>
                    <div className="space-y-4">
                        <button onClick={() => setActiveTab('tech')} className="w-full p-6 border-2 rounded-2xl hover:border-teal-500 hover:bg-teal-50 transition-all text-left group relative">
                            {isProcessing && currentTaskType === 'tech_blog' && (
                                <span className="absolute top-4 right-4 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                                </span>
                            )}
                            <div className="flex items-center gap-3 mb-2"><GitBranch className="text-teal-600 group-hover:scale-110 transition-transform" /><span className="font-bold text-gray-700">기술 블로그 (Tech)</span></div>
                            <p className="text-[11px] text-gray-500 leading-relaxed">GitHub 커밋 로그와 개발 일지를 기록하는 Chirpy 테마 블로그입니다.</p>
                        </button>
                        <button onClick={() => setActiveTab('docs')} className="w-full p-6 border-2 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group relative">
                            {isProcessing && (currentTaskType === 'docs_recommend' || currentTaskType === 'docs_copilot') && (
                                <span className="absolute top-4 right-4 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                </span>
                            )}
                            <div className="flex items-center gap-3 mb-2"><Book className="text-purple-600 group-hover:scale-110 transition-transform" /><span className="font-bold text-gray-700">문서 사이트 (Docs)</span></div>
                            <p className="text-[11px] text-gray-500 leading-relaxed">체계적인 기술 문서, API 가이드, 위키를 위한 Just-the-Docs 사이트입니다.</p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full font-sans shadow-2xl">
            {activeTab === 'tech' ? (
                <TechSettings
                    data={props.techData}
                    setData={props.setTechData}
                    blogList={props.blogList}
                    sourceRepos={props.sourceRepos}
                    categories={props.categories}
                    posts={props.posts}
                    onGenerate={props.onGenerate}
                    onUpload={props.onUpload}
                    isLoading={props.isLoading}
                    onSelectPost={props.onSelectPost}
                    onAddImage={props.onAddImage}
                    isProcessing={props.isProcessing}
                    currentTaskType={props.currentTaskType}
                    onClose={() => setActiveTab(null)}
                    onSaveWorkspace={props.onSaveWorkspace}
                    onRestoreUserWorkspace={props.onRestoreUserWorkspace}
                    hasUserWorkspace={props.hasUserWorkspace}
                />
            ) : (
                <DocsSettings
                    data={props.docsData}
                    setData={props.setDocsData}
                    docsSourceFiles={docsSourceFiles}
                    blogList={props.blogList}
                    posts={props.posts}
                    categories={props.categories}
                    onGenerate={props.onGenerate}
                    onUpload={props.onUpload}
                    isLoading={props.isLoading}
                    onSelectPost={props.onSelectPost}
                    onAddImage={props.onAddImage}
                    isProcessing={props.isProcessing}
                    currentTaskType={props.currentTaskType}
                    onClose={() => setActiveTab(null)}
                    onRestoreAI={props.onRestoreAI}
                    hasDocsScanHistory={props.hasDocsScanHistory}
                    onSaveWorkspace={props.onSaveWorkspace}
                    onRestoreUserWorkspace={props.onRestoreUserWorkspace}
                    hasUserWorkspace={props.hasUserWorkspace}
                />
            )}
        </div>
    );
}

const Section = ({ title, icon: Icon, color, children }) => (
    <div className="mb-4">
        <h4 className={`text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 ${color} opacity-80`}>
            <Icon size={12} strokeWidth={3} /> {title}
        </h4>
        {children}
    </div>
);

// ============================================================================
// [Shared Component] Home Button
// ============================================================================
const HomeButton = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/')}
            className="p-1 hover:bg-gray-100 rounded transition-colors group"
            title="메인으로 돌아가기"
        >
            <Home size={16} className="text-gray-600 group-hover:text-blue-600" />
        </button>
    );
};