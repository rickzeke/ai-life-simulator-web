// AI生活模拟器 - 应用逻辑

const GameState = {
    currentScene: 'start',
    choiceCount: 0,
    history: [],
    achievements: [],
    saveKey: 'ai_life_simulator_save'
};

// 剧情数据
const storyData = {
    start: {
        title: '第一章：租房风波',
        narrative: '毕业季到了，你拖着一个行李箱，站在陌生的城市街头。手机震动，是房东发来的消息...',
        npc: {
            avatar: '🏠',
            name: '房东王大爷',
            dialogue: '小伙子来啦！房子就在前面，我先带你去看看。'
        },
        choices: [
            { text: '好的麻烦王大爷了', next: 'scene1_2', icon: '👋' },
            { text: '我想先看看再说', next: 'scene1_3', icon: '🔍' },
            { text: '可以直接签合同吗', next: 'scene1_4', icon: '📝' }
        ],
        progress: 10
    },
    scene1_2: {
        narrative: '王大爷带你穿过一条小巷，来到一栋老旧的居民楼前。楼道里有股奇怪的味道...',
        npc: {
            avatar: '🏠',
            name: '房东王大爷',
            dialogue: '这房子好啊！南北通透，采光好！就是...稍微有点历史了。'
        },
        choices: [
            { text: '进去看看再说', next: 'scene2_1', icon: '🚪' },
            { text: '这味道是甲醛吧？', next: 'scene2_2', icon: '😷' },
            { text: '附近有地铁吗？', next: 'scene2_3', icon: '🚇' }
        ],
        progress: 25
    },
    scene1_3: {
        narrative: '你决定谨慎一点，先看看再说。王大爷点点头，带着你来到了另一处房源。',
        npc: {
            avatar: '🏠',
            name: '房东王大爷',
            dialogue: '年轻人谨慎点是好事，我还有几套房子，带你看看别的。'
        },
        choices: [
            { text: '谢谢王大爷', next: 'scene2_1', icon: '🙏' },
            { text: '有没有新一点的小区？', next: 'scene2_4', icon: '🏢' }
        ],
        progress: 25
    },
    scene1_4: {
        narrative: '你时间紧迫，想直接签合同。王大爷愣了一下，露出意味深长的笑容...',
        npc: {
            avatar: '🏠',
            name: '房东王大爷',
            dialogue: '哎呀，现在年轻人急性子！好，我这套押一付三，最少签半年。'
        },
        choices: [
            { text: '没问题，现在签', next: 'scene3_quick', icon: '✍️' },
            { text: '还是先看看房子吧', next: 'scene1_2', icon: '🔙' }
        ],
        progress: 25
    },
    scene2_1: {
        narrative: '走进房间，你发现采光确实不错，但墙面斑驳，家具看起来有些年头了。墙上还贴着前任租客留下的海报...',
        npc: {
            avatar: '🛋️',
            name: '房间',
            dialogue: '（房间沉默着，但似乎在诉说自己的故事）'
        },
        choices: [
            { text: '将就一下吧', next: 'scene3_normal', icon: '😌' },
            { text: '这房子需要翻新', next: 'scene3_renovate', icon: '🔨' },
            { text: '再看看别的', next: 'scene1_3', icon: '👀' }
        ],
        progress: 50
    },
    scene2_2: {
        narrative: '你指出可能有甲醛问题。王大爷脸色变了变...' ,
        npc: {
            avatar: '😟',
            name: '房东王大爷',
            dialogue: '年轻人别瞎说！这房子通风三个月了，怎么可能有问题！你不租就算了。'
        },
        choices: [
            { text: '好吧，我再考虑', next: 'scene3_giveup', icon: '😔' },
            { text: '那我不租了', next: 'scene3_giveup', icon: '🚪' }
        ],
        progress: 50
    },
    scene2_3: {
        narrative: '王大爷说有地铁，步行五分钟。你查了查地图，最近地铁站要二十分钟...',
        npc: {
            avatar: '😏',
            name: '房东王大爷',
            dialogue: '我说的"步行"，是腿脚好的情况下。你还年轻，走走就习惯了！'
        },
        choices: [
            { text: '这也太远了吧', next: 'scene3_distance', icon: '😤' },
            { text: '算了，附近也有公交', next: 'scene3_normal', icon: '🚌' }
        ],
        progress: 50
    },
    scene2_4: {
        narrative: '王大爷带你来到一个新建的小区，环境看起来不错，但价格...',
        npc: {
            avatar: '💰',
            name: '中介小李',
            dialogue: '这套精装修，拎包入住，月租3500，押一付三。'
        },
        choices: {
            text: '有点超预算...',
            next: 'scene3_expensive',
            icon: '😰'
        },
        progress: 50
    },
    scene3_quick: {
        narrative: '你匆匆签了合同，交了三个月房租和押金，一共7000块。然而一周后，你发现...',
        npc: {
            avatar: '😱',
            name: '现实',
            dialogue: '（现实给了你沉重一击）'
        },
        choices: [
            { text: '发现什么？', next: 'ending_fast', icon: '❓' }
        ],
        progress: 80
    },
    scene3_normal: {
        narrative: '你决定就租这里了，虽然不完美，但至少有个落脚的地方。生活就是这样，不是吗？',
        npc: {
            avatar: '🔑',
            name: '新生活',
            dialogue: '欢迎来到你的新家！'
        },
        choices: [
            { text: '开始新生活！', next: 'ending_normal', icon: '🎉' }
        ],
        progress: 80
    },
    scene3_renovate: {
        narrative: '你提出想简单翻新一下，王大爷同意了，但要从押金里扣钱...',
        npc: {
            avatar: '🤝',
            name: '房东王大爷',
            dialogue: '行，那我给你500块你自己弄弄，押金里扣啊！'
        },
        choices: [
            { text: '好吧，自己动手', next: 'ending_renovate', icon: '🛠️' },
            { text: '那还是不弄了', next: 'scene3_normal', icon: '➖' }
        ],
        progress: 80
    },
    scene3_giveup: {
        narrative: '你决定不租了，还是先住酒店吧。工作还没着落，租房的事再缓缓...',
        npc: {
            avatar: '🏨',
            name: '酒店',
            dialogue: '欢迎光临，一晚288。'
        },
        choices: [
            { text: '先住一段时间', next: 'ending_hotel', icon: '😴' }
        ],
        progress: 80
    },
    scene3_distance: {
        narrative: '你据理力争，王大爷最终同意每月减100块租金。距离嘛...咬牙坚持吧！',
        npc: {
            avatar: '💪',
            name: '打工人',
            dialogue: '每天多走点路，就当锻炼身体了！'
        },
        choices: [
            { text: '接受现实', next: 'ending_distance', icon: '🚶' }
        ],
        progress: 80
    },
    scene3_expensive: {
        narrative: '3500一个月，押一付三就是14000。你咬咬牙，为了好环境，租了！',
        npc: {
            avatar: '✨',
            name: '新家',
            dialogue: '一切都将是新的！'
        },
        choices: [
            { text: '值得！', next: 'ending_expensive', icon: '💎' }
        ],
        progress: 80
    }
};

// 结局数据
const endings = {
    ending_fast: {
        title: '冲动是魔鬼',
        desc: '你发现水管漏水、墙壁发霉、隔音极差...找王大爷理论，却发现合同里写满了"霸王条款"。押金是要不回来了，就当花钱买教训吧。第一次租房，还是不要太冲动。',
        rating: '⭐⭐',
        choices: 3,
        evaluation: '冲动交易',
        achievements: ['租房小白']
    },
    ending_normal: {
        title: '租房达人',
        desc: '虽然房子不完美，但你学会了接受不完美。生活中总有很多不如意，关键是找到适合自己的节奏。这只是一个开始，未来会更好。',
        rating: '⭐⭐⭐⭐',
        choices: 4,
        evaluation: '稳扎稳打',
        achievements: ['租房达人', '适应生活']
    },
    ending_renovate: {
        title: 'DIY达人',
        desc: '你花了500块买了墙纸和灯泡，把房间布置得温馨又有格调。房东王大爷都夸你有眼光！虽然花了点心思，但这是你的第一个"家"。',
        rating: '⭐⭐⭐⭐⭐',
        choices: 5,
        evaluation: '心灵手巧',
        achievements: ['租房达人', 'DIY达人', '布置高手']
    },
    ending_hotel: {
        title: '酒店常旅客',
        desc: '住酒店虽然方便，但价格实在伤不起。一周后，你的实习工资就快见底了。租房的事还是得提上日程啊...',
        rating: '⭐⭐',
        choices: 3,
        evaluation: '逃避现实',
        achievements: ['酒店试睡员']
    },
    ending_distance: {
        title: '步行侠',
        desc: '每天早起半小时走路通勤，虽然辛苦但也锻炼了身体。每月省下的100块够吃好几顿大餐了。日子虽然紧巴巴，但也充实。',
        rating: '⭐⭐⭐',
        choices: 4,
        evaluation: '勤俭持家',
        achievements: ['步行侠', '早起鸟']
    },
    ending_expensive: {
        title: '品质生活',
        desc: '虽然租金贵，但住得舒服心情好，工作也更有动力！年轻的时候投资自己是对的。不过记得努力赚钱，别让房租成为负担！',
        rating: '⭐⭐⭐⭐⭐',
        choices: 4,
        evaluation: '品质优先',
        achievements: ['品质生活', '独立宣言']
    }
};

// DOM 元素
const elements = {
    startScreen: document.getElementById('startScreen'),
    gameScreen: document.getElementById('gameScreen'),
    endingScreen: document.getElementById('endingScreen'),
    startBtn: document.getElementById('startBtn'),
    storyContainer: document.getElementById('storyContainer'),
    dialogueSection: document.getElementById('dialogueSection'),
    dialogueContent: document.getElementById('dialogueContent'),
    npcAvatar: document.getElementById('npcAvatar'),
    npcName: document.getElementById('npcName'),
    npcStatus: document.getElementById('npcStatus'),
    choicesSection: document.getElementById('choicesSection'),
    progressFill: document.getElementById('progressFill'),
    episodeTitle: document.getElementById('episodeTitle'),
    choiceCount: document.getElementById('choiceCount'),
    achievementPopup: document.getElementById('achievementPopup'),
    achievementIcon: document.getElementById('achievementIcon'),
    achievementTitle: document.getElementById('achievementTitle'),
    achievementDesc: document.getElementById('achievementDesc'),
    endingRating: document.getElementById('endingRating'),
    endingTitle: document.getElementById('endingTitle'),
    endingDesc: document.getElementById('endingDesc'),
    finalChoices: document.getElementById('finalChoices'),
    finalRating: document.getElementById('finalRating'),
    shareBtn: document.getElementById('shareBtn'),
    replayBtn: document.getElementById('replayBtn')
};

// 初始化
function init() {
    loadGame();
    elements.startBtn.addEventListener('click', startGame);
    elements.replayBtn.addEventListener('click', restartGame);
    elements.shareBtn.addEventListener('click', shareResult);
}

// 开始游戏
function startGame() {
    elements.startScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    loadScene('start');
    saveGame();
}

// 加载场景
function loadScene(sceneId) {
    const scene = storyData[sceneId];
    if (!scene) {
        // 可能是结局
        if (sceneId.startsWith('ending_')) {
            showEnding(sceneId);
            return;
        }
        console.error('Scene not found:', sceneId);
        return;
    }

    GameState.currentScene = sceneId;
    GameState.history.push(sceneId);

    // 更新标题和进度
    elements.episodeTitle.textContent = scene.title || '第一章：租房风波';
    elements.progressFill.style.width = scene.progress + '%';

    // 更新选择次数
    if (sceneId !== 'start') {
        GameState.choiceCount++;
        elements.choiceCount.textContent = GameState.choiceCount + ' 次选择';
    }

    // 显示剧情叙述
    elements.storyContainer.innerHTML = `
        <div class="narrative">
            <p class="narrative-text">${scene.narrative}</p>
        </div>
    `;

    // 显示对话
    if (scene.npc) {
        elements.dialogueSection.classList.remove('hidden');
        elements.npcAvatar.textContent = scene.npc.avatar;
        elements.npcName.textContent = scene.npc.name;
        
        // 打字机效果
        elements.dialogueContent.innerHTML = `<p class="dialogue-text">${scene.npc.dialogue}</p>`;
    } else {
        elements.dialogueSection.classList.add('hidden');
    }

    // 显示选项
    renderChoices(scene.choices);
    
    // 滚动到顶部
    elements.storyContainer.scrollTop = 0;
    
    saveGame();
}

// 渲染选项
function renderChoices(choices) {
    elements.choicesSection.innerHTML = '';
    
    if (!choices) return;

    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-icon">${choice.icon}</span>${choice.text}`;
        btn.style.animationDelay = (index * 0.1) + 's';
        btn.addEventListener('click', () => loadScene(choice.next));
        elements.choicesSection.appendChild(btn);
    });
}

// 显示结局
function showEnding(endingId) {
    const ending = endings[endingId];
    if (!ending) {
        console.error('Ending not found:', endingId);
        return;
    }

    elements.gameScreen.classList.add('hidden');
    elements.endingScreen.classList.remove('hidden');

    elements.endingRating.textContent = ending.rating;
    elements.endingTitle.textContent = ending.title;
    elements.endingDesc.textContent = ending.desc;
    elements.finalChoices.textContent = GameState.choiceCount;
    elements.finalRating.textContent = ending.evaluation;

    // 显示成就
    ending.achievements.forEach((achievement, index) => {
        if (!GameState.achievements.includes(achievement)) {
            GameState.achievements.push(achievement);
            setTimeout(() => showAchievement(achievement), index * 1500);
        }
    });

    // 更新最终进度
    elements.progressFill.style.width = '100%';
    
    saveGame();
}

// 显示成就弹窗
function showAchievement(name) {
    const achievementIcons = {
        '租房小白': '🌱',
        '租房达人': '🏠',
        '适应生活': '🌿',
        'DIY达人': '🛠️',
        '布置高手': '🎨',
        '酒店试睡员': '🛏️',
        '步行侠': '🚶',
        '早起鸟': '🌅',
        '品质生活': '💎',
        '独立宣言': '🚀'
    };

    elements.achievementIcon.textContent = achievementIcons[name] || '🏆';
    elements.achievementTitle.textContent = '成就解锁！';
    elements.achievementDesc.textContent = name;
    elements.achievementPopup.classList.remove('hidden');

    setTimeout(() => {
        elements.achievementPopup.classList.add('hidden');
    }, 2500);
}

// 分享结果
function shareResult() {
    const title = elements.endingTitle.textContent;
    const desc = elements.endingDesc.textContent.substring(0, 50) + '...';
    
    if (navigator.share) {
        navigator.share({
            title: 'AI生活模拟器 - ' + title,
            text: desc + '\n\n我的结局：' + title + '\n来试试你的租房之旅！',
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        const text = 'AI生活模拟器 - ' + title + '\n' + desc + '\n来试试你的租房之旅！';
        navigator.clipboard.writeText(text).then(() => {
            alert('结果已复制到剪贴板！');
        });
    }
}

// 重新开始
function restartGame() {
    GameState.currentScene = 'start';
    GameState.choiceCount = 0;
    GameState.history = [];
    
    elements.endingScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    
    loadScene('start');
}

// 保存游戏
function saveGame() {
    const saveData = {
        currentScene: GameState.currentScene,
        choiceCount: GameState.choiceCount,
        history: GameState.history,
        achievements: GameState.achievements,
        timestamp: Date.now()
    };
    localStorage.setItem(GameState.saveKey, JSON.stringify(saveData));
}

// 加载游戏
function loadGame() {
    const saved = localStorage.getItem(GameState.saveKey);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // 可以选择恢复进度或重新开始
            // 这里我们选择不自动恢复，让玩家重新开始
        } catch (e) {
            console.error('Save data corrupted');
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
