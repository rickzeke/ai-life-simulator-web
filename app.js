// AI生活模拟器 - 应用逻辑

const GameState = {
    currentScenario: null,
    currentScene: 'start',
    choiceCount: 0,
    history: [],
    achievements: [],
    skills: { communication: 0, technical: 0, management: 0, officePolitics: 0 },
    salary: 0,
    position: '待业',
    companyType: null,
    saveKey: 'ai_life_simulator_save'
};

// ============ 租房剧情数据 ============
const apartmentStory = {
    start: {
        title: '第一章：租房风波',
        narrative: '毕业季到了，你拖着一个行李箱，站在陌生的城市街头。手机震动，是房东发来的消息...',
        npc: { avatar: '🏠', name: '房东王大爷', dialogue: '小伙子来啦！房子就在前面，我先带你去看看。' },
        choices: [
            { text: '好的麻烦王大爷了', next: 'apt_scene1_2', icon: '👋' },
            { text: '我想先看看再说', next: 'apt_scene1_3', icon: '🔍' },
            { text: '可以直接签合同吗', next: 'apt_scene1_4', icon: '📝' }
        ],
        progress: 10
    },
    apt_scene1_2: {
        title: '第一章：租房风波',
        narrative: '王大爷带你穿过一条小巷，来到一栋老旧的居民楼前。楼道里有股奇怪的味道...',
        npc: { avatar: '🏠', name: '房东王大爷', dialogue: '这房子好啊！南北通透，采光好！就是...稍微有点历史了。' },
        choices: [
            { text: '进去看看再说', next: 'apt_scene2_1', icon: '🚪' },
            { text: '这味道是甲醛吧？', next: 'apt_scene2_2', icon: '😷' },
            { text: '附近有地铁吗？', next: 'apt_scene2_3', icon: '🚇' }
        ],
        progress: 25
    },
    apt_scene1_3: {
        title: '第一章：租房风波',
        narrative: '你决定谨慎一点，先看看再说。王大爷点点头，带着你来到了另一处房源。',
        npc: { avatar: '🏠', name: '房东王大爷', dialogue: '年轻人谨慎点是好事，我还有几套房子，带你看看别的。' },
        choices: [
            { text: '谢谢王大爷', next: 'apt_scene2_1', icon: '🙏' },
            { text: '有没有新一点的小区？', next: 'apt_scene2_4', icon: '🏢' }
        ],
        progress: 25
    },
    apt_scene1_4: {
        title: '第一章：租房风波',
        narrative: '你时间紧迫，想直接签合同。王大爷愣了一下，露出意味深长的笑容...',
        npc: { avatar: '🏠', name: '房东王大爷', dialogue: '哎呀，现在年轻人急性子！好，我这套押一付三，最少签半年。' },
        choices: [
            { text: '没问题，现在签', next: 'apt_scene3_quick', icon: '✍️' },
            { text: '还是先看看房子吧', next: 'apt_scene1_2', icon: '🔙' }
        ],
        progress: 25
    },
    apt_scene2_1: {
        title: '第一章：租房风波',
        narrative: '走进房间，你发现采光确实不错，但墙面斑驳，家具看起来有些年头了。墙上还贴着前任租客留下的海报...',
        npc: { avatar: '🛋️', name: '房间', dialogue: '（房间沉默着，但似乎在诉说自己的故事）' },
        choices: [
            { text: '将就一下吧', next: 'apt_scene3_normal', icon: '😌' },
            { text: '这房子需要翻新', next: 'apt_scene3_renovate', icon: '🔨' },
            { text: '再看看别的', next: 'apt_scene1_3', icon: '👀' }
        ],
        progress: 50
    },
    apt_scene2_2: {
        title: '第一章：租房风波',
        narrative: '你指出可能有甲醛问题。王大爷脸色变了变...',
        npc: { avatar: '😟', name: '房东王大爷', dialogue: '年轻人别瞎说！这房子通风三个月了，怎么可能有问题！你不租就算了。' },
        choices: [
            { text: '好吧，我再考虑', next: 'apt_scene3_giveup', icon: '😔' },
            { text: '那我不租了', next: 'apt_scene3_giveup', icon: '🚪' }
        ],
        progress: 50
    },
    apt_scene2_3: {
        title: '第一章：租房风波',
        narrative: '王大爷说有地铁，步行五分钟。你查了查地图，最近地铁站要二十分钟...',
        npc: { avatar: '😏', name: '房东王大爷', dialogue: '我说的"步行"，是腿脚好的情况下。你还年轻，走走就习惯了！' },
        choices: [
            { text: '这也太远了吧', next: 'apt_scene3_distance', icon: '😤' },
            { text: '算了，附近也有公交', next: 'apt_scene3_normal', icon: '🚌' }
        ],
        progress: 50
    },
    apt_scene2_4: {
        title: '第一章：租房风波',
        narrative: '王大爷带你来到一个新建的小区，环境看起来不错，但价格...',
        npc: { avatar: '💰', name: '中介小李', dialogue: '这套精装修，拎包入住，月租3500，押一付三。' },
        choices: [{ text: '有点超预算...', next: 'apt_scene3_expensive', icon: '😰' }],
        progress: 50
    },
    apt_scene3_quick: {
        title: '第一章：租房风波',
        narrative: '你匆匆签了合同，交了三个月房租和押金，一共7000块。然而一周后，你发现...',
        npc: { avatar: '😱', name: '现实', dialogue: '（现实给了你沉重一击）' },
        choices: [{ text: '发现什么？', next: 'apt_ending_fast', icon: '❓' }],
        progress: 80
    },
    apt_scene3_normal: {
        title: '第一章：租房风波',
        narrative: '你决定就租这里了，虽然不完美，但至少有个落脚的地方。生活就是这样，不是吗？',
        npc: { avatar: '🔑', name: '新生活', dialogue: '欢迎来到你的新家！' },
        choices: [{ text: '开始新生活！', next: 'apt_ending_normal', icon: '🎉' }],
        progress: 80
    },
    apt_scene3_renovate: {
        title: '第一章：租房风波',
        narrative: '你提出想简单翻新一下，王大爷同意了，但要从押金里扣钱...',
        npc: { avatar: '🤝', name: '房东王大爷', dialogue: '行，那我给你500块你自己弄弄，押金里扣啊！' },
        choices: [
            { text: '好吧，自己动手', next: 'apt_ending_renovate', icon: '🛠️' },
            { text: '那还是不弄了', next: 'apt_scene3_normal', icon: '➖' }
        ],
        progress: 80
    },
    apt_scene3_giveup: {
        title: '第一章：租房风波',
        narrative: '你决定不租了，还是先住酒店吧。工作还没着落，租房的事再缓缓...',
        npc: { avatar: '🏨', name: '酒店', dialogue: '欢迎光临，一晚288。' },
        choices: [{ text: '先住一段时间', next: 'apt_ending_hotel', icon: '😴' }],
        progress: 80
    },
    apt_scene3_distance: {
        title: '第一章：租房风波',
        narrative: '你据理力争，王大爷最终同意每月减100块租金。距离嘛...咬牙坚持吧！',
        npc: { avatar: '💪', name: '打工人', dialogue: '每天多走点路，就当锻炼身体了！' },
        choices: [{ text: '接受现实', next: 'apt_ending_distance', icon: '🚶' }],
        progress: 80
    },
    apt_scene3_expensive: {
        title: '第一章：租房风波',
        narrative: '3500一个月，押一付三就是14000。你咬咬牙，为了好环境，租了！',
        npc: { avatar: '✨', name: '新家', dialogue: '一切都将是新的！' },
        choices: [{ text: '值得！', next: 'apt_ending_expensive', icon: '💎' }],
        progress: 80
    }
};

const apartmentEndings = {
    apt_ending_fast: { title: '冲动是魔鬼', desc: '你发现水管漏水、墙壁发霉、隔音极差...找王大爷理论，却发现合同里写满了"霸王条款"。押金是要不回来了，就当花钱买教训吧。第一次租房，还是不要太冲动。', rating: '⭐⭐', choices: 3, evaluation: '冲动交易', achievements: ['租房小白'] },
    apt_ending_normal: { title: '租房达人', desc: '虽然房子不完美，但你学会了接受不完美。生活中总有很多不如意，关键是找到适合自己的节奏。这只是一个开始，未来会更好。', rating: '⭐⭐⭐⭐', choices: 4, evaluation: '稳扎稳打', achievements: ['租房达人', '适应生活'] },
    apt_ending_renovate: { title: 'DIY达人', desc: '你花了500块买了墙纸和灯泡，把房间布置得温馨又有格调。房东王大爷都夸你有眼光！虽然花了点心思，但这是你的第一个"家"。', rating: '⭐⭐⭐⭐⭐', choices: 5, evaluation: '心灵手巧', achievements: ['租房达人', 'DIY达人', '布置高手'] },
    apt_ending_hotel: { title: '酒店常旅客', desc: '住酒店虽然方便，但价格实在伤不起。一周后，你的实习工资就快见底了。租房的事还是得提上日程啊...', rating: '⭐⭐', choices: 3, evaluation: '逃避现实', achievements: ['酒店试睡员'] },
    apt_ending_distance: { title: '步行侠', desc: '每天早起半小时走路通勤，虽然辛苦但也锻炼了身体。每月省下的100块够吃好几顿大餐了。日子虽然紧巴巴，但也充实。', rating: '⭐⭐⭐', choices: 4, evaluation: '勤俭持家', achievements: ['步行侠', '早起鸟'] },
    apt_ending_expensive: { title: '品质生活', desc: '虽然租金贵，但住得舒服心情好，工作也更有动力！年轻的时候投资自己是对的。不过记得努力赚钱，别让房租成为负担！', rating: '⭐⭐⭐⭐⭐', choices: 4, evaluation: '品质优先', achievements: ['品质生活', '独立宣言'] }
};

// ============ 职场剧情数据 ============
const officeStory = {
    start: {
        title: '序章：求职之路',
        narrative: '毕业季，你投出了二十多份简历，终于收到了几家公司的面试邀请。今天，你要去第一家公司面试...',
        npc: { avatar: '💼', name: '你', dialogue: '（深吸一口气，走进公司大门）' },
        choices: [{ text: '准时到达前台', next: 'office_interview_1', icon: '🕐' }],
        progress: 5
    },
    office_interview_1: {
        title: '序章：求职之路',
        narrative: '前台小姐姐微笑着让你填表。表格很长，有一栏写着"期望薪资"。你刚毕业，没什么工作经验，该怎么填？',
        npc: { avatar: '👩‍💼', name: '前台', dialogue: '请在这里填一下基本信息，我们HR马上来。' },
        choices: [
            { text: '写个保守的数字：8000', next: 'office_interview_2a', icon: '🤔' },
            { text: '写行业平均：12000', next: 'office_interview_2b', icon: '💪' },
            { text: '写个高的：20000', next: 'office_interview_2c', icon: '🔥' }
        ],
        progress: 15
    },
    office_interview_2a: {
        title: '序章：求职之路',
        narrative: '你写下8000。HR看了表格一眼，眉头微微皱起，但没有说什么。',
        npc: { avatar: '👨‍💼', name: 'HR李经理', dialogue: '先做个自我介绍吧，为什么想加入我们公司？' },
        choices: [
            { text: '我学习能力强，愿意从基础做起', next: 'office_interview_3a', icon: '📚' },
            { text: '我对这个行业非常感兴趣', next: 'office_interview_3b', icon: '🎯' },
            { text: '我想找一份稳定的工作', next: 'office_interview_3c', icon: '🏠' }
        ],
        progress: 25
    },
    office_interview_2b: {
        title: '序章：求职之路',
        narrative: '你写下12000。HR挑了挑眉，这个数字在应届生里算合理的。',
        npc: { avatar: '👨‍💼', name: 'HR李经理', dialogue: '好，那我们聊聊。你觉得自己有什么优势？' },
        choices: [
            { text: '我技术扎实，项目经验丰富', next: 'office_interview_3d', icon: '💻' },
            { text: '我善于沟通，团队协作能力很强', next: 'office_interview_3e', icon: '🗣️' },
            { text: '我能快速适应环境，抗压能力强', next: 'office_interview_3f', icon: '💪' }
        ],
        progress: 25
    },
    office_interview_2c: {
        title: '序章：求职之路',
        narrative: '你写下20000。HR的表情变得微妙了，上下打量了你一番。',
        npc: { avatar: '🤨', name: 'HR李经理', dialogue: '你觉得你凭什么拿这个薪资？' },
        choices: [
            { text: '我相信我能给公司创造相应价值', next: 'office_interview_3g', icon: '💎' },
            { text: '我了解到行业薪资水平都差不多', next: 'office_interview_3h', icon: '📊' },
            { text: '抱歉，我可以调整', next: 'office_interview_3i', icon: '😅' }
        ],
        progress: 25
    },
    office_interview_3a: {
        title: '技术面试',
        narrative: '技术主管进来了，看了看你的简历，开始问技术问题。',
        npc: { avatar: '👨‍💻', name: '技术主管张工', dialogue: '谈谈你做过的项目吧，用了什么技术栈？' },
        choices: [
            { text: '详细描述项目，技术细节一一道来', next: 'office_result_low', icon: '📖' },
            { text: '简洁明了，突出成果和数据', next: 'office_result_mid', icon: '📈' }
        ],
        progress: 40
    },
    office_interview_3b: {
        title: '技术面试',
        narrative: '技术主管来了，对你的回答不置可否。',
        npc: { avatar: '👨‍💻', name: '技术主管张工', dialogue: '好，那我们聊聊技术，你觉得自己的代码能力怎么样？' },
        choices: [
            { text: '能独立完成项目，也懂代码规范', next: 'office_result_mid', icon: '✅' },
            { text: '我还在学习，但我学得很快', next: 'office_result_low', icon: '📚' }
        ],
        progress: 40
    },
    office_interview_3c: {
        title: '技术面试',
        narrative: '技术主管皱起了眉头。',
        npc: { avatar: '😕', name: '技术主管张工', dialogue: '我们这里工作压力不小，你能适应吗？' },
        choices: [
            { text: '我愿意学习，能适应', next: 'office_result_low', icon: '💪' },
            { text: '我查过贵公司，加班情况还好', next: 'office_result_mid', icon: '🔍' }
        ],
        progress: 40
    },
    office_interview_3d: {
        title: '技术面试',
        narrative: '技术主管眼睛一亮，看起来对你的项目经历很感兴趣。',
        npc: { avatar: '😊', name: '技术主管张工', dialogue: '你这个项目很有意思！能详细说说你们是怎么解决高并发问题的吗？' },
        choices: [
            { text: '从容回答，展现技术深度', next: 'office_result_high', icon: '🏆' },
            { text: '回答中有些紧张，但大体正确', next: 'office_result_mid', icon: '👌' }
        ],
        progress: 40
    },
    office_interview_3e: {
        title: '技术面试',
        narrative: '技术主管对你的软技能印象深刻。',
        npc: { avatar: '👍', name: '技术主管张工', dialogue: '技术可以培养，沟通能力是难得的。你对薪资有什么想法？' },
        choices: [
            { text: '说出一个合理的数字，展现诚意', next: 'office_result_mid', icon: '🤝' },
            { text: '表示愿意服从公司安排', next: 'office_result_low', icon: '🙏' }
        ],
        progress: 40
    },
    office_interview_3f: {
        title: '技术面试',
        narrative: '技术主管点点头，似乎对你印象不错。',
        npc: { avatar: '👨‍💻', name: '技术主管张工', dialogue: '好，最后一个问题：你有什么想问我的吗？' },
        choices: [
            { text: '问技术团队规模和技术栈', next: 'office_result_mid', icon: '💻' },
            { text: '问晋升机制和成长空间', next: 'office_result_high', icon: '📈' },
            { text: '问加班情况和薪酬结构', next: 'office_result_mid', icon: '❓' }
        ],
        progress: 40
    },
    office_interview_3g: {
        title: '技术面试',
        narrative: '你自信的回答让技术主管产生了一点兴趣。',
        npc: { avatar: '🤔', name: '技术主管张工', dialogue: '好，那我们来聊聊实际的技术问题...' },
        choices: [
            { text: '充分准备，对答如流', next: 'office_result_mid', icon: '🎯' },
            { text: '部分问题答不上来，但态度诚恳', next: 'office_result_low', icon: '😅' }
        ],
        progress: 40
    },
    office_interview_3h: {
        title: '技术面试',
        narrative: 'HR的表情有些微妙，但还是继续了面试。',
        npc: { avatar: '😐', name: 'HR李经理', dialogue: '那技术面一下吧，你熟悉哪些技术？' },
        choices: [
            { text: '列出自己擅长的技术栈', next: 'office_result_low', icon: '📝' },
            { text: '坦诚说只熟悉核心的，其他在学的', next: 'office_result_low', icon: '💬' }
        ],
        progress: 40
    },
    office_interview_3i: {
        title: '技术面试',
        narrative: '你改成了12000，HR的态度缓和了一些。',
        npc: { avatar: '👨‍💼', name: 'HR李经理', dialogue: '好，那我们来走一下技术面试流程。' },
        choices: [
            { text: '认真准备，对答如流', next: 'office_result_mid', icon: '📖' },
            { text: '有些紧张，部分问题答不好', next: 'office_result_low', icon: '😰' }
        ],
        progress: 40
    },
    office_result_low: {
        title: '面试结果',
        narrative: '一周后，你收到了拒信。虽然有些失落，但这是你第一次面试，还有很多需要学习的地方。',
        npc: { avatar: '📧', name: '邮件', dialogue: '（感谢您的投递，但目前我们暂不考虑...）' },
        choices: [{ text: '继续面试其他公司', next: 'office_day1', icon: '➡️' }],
        progress: 60
    },
    office_result_mid: {
        title: '面试结果',
        narrative: '恭喜你！一周后，你收到了offer。虽然薪资不算高，但这是个不错的起点。你决定接受这个offer。',
        npc: { avatar: '🎉', name: 'HR', dialogue: '恭喜你通过面试！欢迎加入我们！' },
        choices: [{ text: '接受offer，入职第一天', next: 'office_day1', icon: '✅' }],
        progress: 60
    },
    office_result_high: {
        title: '面试结果',
        narrative: '你的表现出色，收到了offer，薪资比预期还高一些！看来你的准备没有白费。',
        npc: { avatar: '🎊', name: 'HR', dialogue: '恭喜你！你的面试表现非常出色，我们决定录用你！' },
        choices: [{ text: '接受offer，入职第一天', next: 'office_day1', icon: '✅' }],
        progress: 60
    },
    office_day1: {
        title: '第一章：职场新人',
        narrative: '入职第一天，主管老王给你分配了工位，介绍了周围的同事。你旁边是一位看起来很忙的年轻人——小陈。',
        npc: { avatar: '👨‍💻', name: '小陈', dialogue: '欢迎，桌上有本员工手册，有空看看。哦对了，下午要开周会，记得参加。' },
        choices: [
            { text: '认真看员工手册，了解公司制度', next: 'office_day1_handbook', icon: '📖' },
            { text: '主动和小陈聊天，熟悉环境', next: 'office_day1_chat', icon: '💬' },
            { text: '先熟悉项目代码', next: 'office_day1_code', icon: '💻' }
        ],
        progress: 70
    },
    office_day1_handbook: {
        title: '第一章：职场新人',
        narrative: '你仔细阅读了员工手册，发现公司有很多隐性规则：比如报销流程、午休时间等。你对公司的运作有了初步了解。',
        npc: { avatar: '📋', name: '员工手册', dialogue: '（读完了，但好像又忘了...）' },
        choices: [{ text: '参加下午的周会', next: 'office_meeting_1', icon: '🗓️' }],
        progress: 75
    },
    office_day1_chat: {
        title: '第一章：职场新人',
        narrative: '小陈终于抬起头了，他告诉你一些"潜规则"：谁不好惹、什么时间点不能找谁、哪些会议其实不重要可以不去...',
        npc: { avatar: '🤫', name: '小陈', dialogue: '在公司里，技术能力只是一部分。懂得站队和说话，比什么都重要。' },
        choices: [{ text: '参加下午的周会', next: 'office_meeting_1', icon: '🗓️' }],
        progress: 75
    },
    office_day1_code: {
        title: '第一章：职场新人',
        narrative: '你打开代码仓库，发现项目结构比你想象的要复杂。还好有几个README，你大概看懂了架构。这时，主管老王走过来。',
        npc: { avatar: '👨‍🔧', name: '主管老王', dialogue: '小王啊，下午有个周会，你也来旁听一下，了解一下团队情况。' },
        choices: [{ text: '去参加周会', next: 'office_meeting_1', icon: '🗓️' }],
        progress: 75
    },
    office_meeting_1: {
        title: '第一章：职场新人',
        narrative: '会议室里坐了十几个人，产品经理小李正在汇报项目进度。气氛有些紧张，似乎在讨论一个技术方案的选择问题。',
        npc: { avatar: '📊', name: '产品经理小李', dialogue: '我们需要在两周内上线这个功能，技术方案大家有什么意见？' },
        choices: [
            { text: '认真听，不发表意见（新人少说话）', next: 'office_meeting_silent', icon: '👀' },
            { text: '大胆提出自己的想法', next: 'office_meeting_speak', icon: '🗣️' },
            { text: '观察各方反应，判断形势', next: 'office_meeting_observe', icon: '🔍' }
        ],
        progress: 80
    },
    office_meeting_silent: {
        title: '第一章：职场新人',
        narrative: '会议结束了，你全程没有发言，虽然没出风头，但也没出错。主管老王拍了拍你的肩膀：',
        npc: { avatar: '👨‍🔧', name: '主管老王', dialogue: '第一周就好好听，多学习，不着急表达。等熟悉了再说。' },
        choices: [{ text: '继续第一天的工作', next: 'office_week1', icon: '➡️' }],
        progress: 85
    },
    office_meeting_speak: {
        title: '第一章：职场新人',
        narrative: '你大胆提出了一个技术方案。会议室突然安静了，所有人都看着你。几秒钟后，有人开始质疑你的方案...',
        npc: { avatar: '😳', name: '资深工程师老张', dialogue: '这个方案我之前试过，有问题。你是新人吧？' },
        choices: [
            { text: '坚持自己的观点，给出论据', next: 'office_meeting_defend', icon: '💪' },
            { text: '承认自己考虑不周，表示会再学习', next: 'office_meeting_yield', icon: '🙏' }
        ],
        progress: 85
    },
    office_meeting_defend: {
        title: '第一章：职场新人',
        narrative: '你冷静地解释了方案的优势，并承认了可能的缺陷，给出了优化思路。会议室里开始有人点头...',
        npc: { avatar: '👏', name: 'CTO', dialogue: '不错，新人能有这个思考深度很难得。老王，你带的这个新人不错。' },
        choices: [{ text: '第一天就获得认可，继续加油', next: 'office_week1_star', icon: '⭐' }],
        progress: 90
    },
    office_meeting_yield: {
        title: '第一章：职场新人',
        narrative: '你承认了自己的不足。会后主管老王悄悄对你说：',
        npc: { avatar: '👍', name: '主管老王', dialogue: '有想法是好事，但在会议上要讲究方式方法。你还年轻，慢慢来。' },
        choices: [{ text: '继续第一周的工作', next: 'office_week1', icon: '➡️' }],
        progress: 90
    },
    office_meeting_observe: {
        title: '第一章：职场新人',
        narrative: '你安静地观察着会议的走向。你注意到技术总监和CEO在某些问题上意见不合，而老员工们似乎都在"选边站"...',
        npc: { avatar: '🧠', name: '你', dialogue: '原来公司里也有派系斗争...' },
        choices: [{ text: '继续保持低调观察', next: 'office_week1', icon: '👀' }],
        progress: 90
    },
    office_week1_star: {
        title: '第一章：职场新人',
        narrative: '第一周结束，你因为会议上的表现被主管老王记住了。他给你安排了一个重要但不难的任务作为考核。',
        npc: { avatar: '🎯', name: '主管老王', dialogue: '好好干，完成这个任务，下个月转正答辩应该没问题。' },
        choices: [{ text: '努力完成任务', next: 'office_month1', icon: '💪' }],
        progress: 95
    },
    office_week1: {
        title: '第一章：职场新人',
        narrative: '第一周很快过去了。你逐渐熟悉了工作节奏，也认识了更多同事。主管老王给你安排了第一个正式任务。',
        npc: { avatar: '📝', name: '主管老王', dialogue: '这是一个小功能模块的开发，不急，两周内完成就行。有什么问题随时问我。' },
        choices: [{ text: '两周时间绰绰有余，先摸清需求', next: 'office_month1', icon: '📋' }],
        progress: 95
    },
    office_month1: {
        title: '第一章：职场新人',
        narrative: '一个月过去了。你成功转正，成为了一名正式的工程师。但新的挑战也随之而来...',
        npc: { avatar: '🎉', name: 'HR', dialogue: '恭喜你通过试用期！欢迎正式成为公司的一员。' },
        choices: [{ text: '继续职场修炼之路', next: 'office_ending_normal', icon: '➡️' }],
        progress: 98
    },
    office_ending_normal: {
        title: '普通结局',
        narrative: '你的职场生涯正式开始。虽然起点普通，但一切皆有可能。未来还有很长的路要走，每一个选择都将塑造你的职业轨迹。',
        npc: { avatar: '🚀', name: '新征程', dialogue: '（前方还有很多挑战等着你...未完待续）' },
        choices: [{ text: '未完待续', next: 'office_final', icon: '📖' }],
        progress: 100
    },
    office_final: {
        title: '职场新星',
        narrative: '从新人到独当一面的工程师，你用智慧和努力在职场中找到了自己的位置。公司里流传着你的传说——那个第一天就敢在会议上发言的年轻人。',
        npc: { avatar: '🏆', name: '结局', dialogue: '（恭喜你解锁了职场新星结局！后续章节开发中...）' },
        choices: [{ text: '返回主页', next: 'game_complete', icon: '🏠' }],
        progress: 100
    }
};

const officeEndings = {
    office_final: { title: '职场新星', desc: '从新人到独当一面的工程师，你用智慧和努力在职场中找到了自己的位置。公司里流传着你的传说——那个第一天就敢在会议上发言的年轻人。', rating: '⭐⭐⭐⭐⭐', choices: 10, evaluation: '职场新星', achievements: ['职场新人', '技术达人', '沟通高手'] },
    office_ending_normal: { title: '稳扎稳打', desc: '你的职场开局平淡但充实。转正了，但你知道这只是开始。未来还有更多挑战：晋升、跳槽、裁员、创业...每一个选择都将改变你的命运。', rating: '⭐⭐⭐⭐', choices: 8, evaluation: '稳扎稳打', achievements: ['职场新人', '适应力强'] }
};

// ============ DOM元素 ============
const $ = id => document.getElementById(id);
const els = {
    startScreen: $('startScreen'),
    gameScreen: $('gameScreen'),
    endingScreen: $('endingScreen'),
    startBtn: $('startBtn'),
    scenarioCards: $('scenarioCards'),
    storyContainer: $('storyContainer'),
    dialogueSection: $('dialogueSection'),
    dialogueContent: $('dialogueContent'),
    npcAvatar: $('npcAvatar'),
    npcName: $('npcName'),
    npcStatus: $('npcStatus'),
    choicesSection: $('choicesSection'),
    progressFill: $('progressFill'),
    episodeTitle: $('episodeTitle'),
    choiceCount: $('choiceCount'),
    achievementPopup: $('achievementPopup'),
    achievementIcon: $('achievementIcon'),
    achievementTitle: $('achievementTitle'),
    achievementDesc: $('achievementDesc'),
    endingRating: $('endingRating'),
    endingTitle: $('endingTitle'),
    endingDesc: $('endingDesc'),
    finalChoices: $('finalChoices'),
    finalRating: $('finalRating'),
    shareBtn: $('shareBtn'),
    replayBtn: $('replayBtn'),
    backToHomeBtn: $('backToHomeBtn'),
    skillPanel: $('skillPanel')
};

// ============ 初始化 ============
function init() {
    loadGame();
    els.startBtn.addEventListener('click', showScenarios);
    els.replayBtn.addEventListener('click', restartGame);
    els.shareBtn.addEventListener('click', shareResult);
    if (els.backToHomeBtn) {
        els.backToHomeBtn.addEventListener('click', backToHome);
    }
    renderScenarioCards();
}

function renderScenarioCards() {
    els.scenarioCards.innerHTML = `
        <div class="scenario-card" data-scenario="apartment">
            <div class="scenario-icon">🏠</div>
            <div class="scenario-info">
                <h3>租房奇遇</h3>
                <p>毕业季到了，你拖着行李箱站在陌生的城市街头...</p>
                <div class="scenario-tags">
                    <span class="tag">新手推荐</span>
                    <span class="tag">6种结局</span>
                </div>
            </div>
            <div class="scenario-play-btn">开始</div>
        </div>
        <div class="scenario-card office-card" data-scenario="office">
            <div class="scenario-icon">💼</div>
            <div class="scenario-info">
                <h3>职场修炼</h3>
                <p>从求职面试到职场晋升，体验真实的职场人生...</p>
                <div class="scenario-tags">
                    <span class="tag new-tag">新增</span>
                    <span class="tag">10+结局</span>
                </div>
            </div>
            <div class="scenario-play-btn">开始</div>
        </div>
    `;
    els.scenarioCards.querySelectorAll('.scenario-card').forEach(card => {
        card.addEventListener('click', () => startGame(card.dataset.scenario));
    });
}

function showScenarios() {
    const logo = els.startScreen.querySelector('.logo-container');
    const btnContainer = els.startScreen.querySelector('.start-btn-container');
    const features = els.startScreen.querySelector('.features');
    if (logo) logo.style.display = 'none';
    if (btnContainer) btnContainer.style.display = 'none';
    if (features) features.style.display = 'none';
    els.scenarioCards.style.display = 'flex';
    els.scenarioCards.classList.add('visible');
}

function startGame(scenario) {
    GameState.currentScenario = scenario;
    GameState.currentScene = 'start';
    GameState.choiceCount = 0;
    GameState.history = [];
    GameState.achievements = [];
    GameState.skills = { communication: 0, technical: 0, management: 0, officePolitics: 0 };
    GameState.salary = 0;
    GameState.position = '待业';
    GameState.companyType = null;

    document.body.className = scenario === 'office' ? 'theme-office' : 'theme-apartment';
    els.startScreen.classList.add('hidden');
    els.gameScreen.classList.remove('hidden');
    if (scenario === 'office' && els.skillPanel) {
        els.skillPanel.classList.remove('hidden');
        updateSkillPanel();
    } else if (els.skillPanel) {
        els.skillPanel.classList.add('hidden');
    }
    loadScene('start');
    saveGame();
}

function updateSkillPanel() {
    if (!els.skillPanel) return;
    const s = GameState.skills;
    const skillBars = els.skillPanel.querySelectorAll('.skill-bar-fill');
    const skillValues = els.skillPanel.querySelectorAll('.skill-value');
    const maxSkill = 5;
    const skills = ['communication', 'technical', 'management', 'officePolitics'];
    skills.forEach((skill, i) => {
        if (skillBars[i]) skillBars[i].style.width = (s[skill] / maxSkill * 100) + '%';
        if (skillValues[i]) skillValues[i].textContent = s[skill];
    });
}


function loadScene(sceneId) {
    const isOffice = GameState.currentScenario === 'office';
    const storyData = isOffice ? officeStory : apartmentStory;
    const scene = storyData[sceneId];

    if (!scene) {
        if (sceneId === 'game_complete') {
            showOfficeEnding();
            return;
        }
        if (sceneId.startsWith('apt_ending_')) {
            showEnding(sceneId, apartmentEndings);
            return;
        }
        if (sceneId.startsWith('office_')) {
            showEnding(sceneId, officeEndings);
            return;
        }
        console.error('Scene not found:', sceneId);
        return;
    }

    GameState.currentScene = sceneId;
    GameState.history.push(sceneId);

    els.episodeTitle.textContent = scene.title || (isOffice ? '序章：求职之路' : '第一章：租房风波');
    els.progressFill.style.width = scene.progress + '%';

    if (sceneId !== 'start') {
        const prefix = isOffice ? 'office_' : 'apt_';
        if (!sceneId.startsWith(prefix + 'scene') && !sceneId.startsWith(prefix + 'interview') && !sceneId.startsWith(prefix + 'meeting') && !sceneId.startsWith(prefix + 'day') && !sceneId.startsWith(prefix + 'week') && !sceneId.startsWith(prefix + 'month') && !sceneId.startsWith(prefix + 'result') && !sceneId.startsWith(prefix + 'ending')) {
            GameState.choiceCount++;
        } else if (!['office_day1', 'apt_start', 'office_start'].includes(sceneId)) {
            // choice counted for sub-scenes
        }
        if (sceneId.includes('_2') || sceneId.includes('_3') || sceneId.includes('_1 ') || 
            (sceneId.includes('_a') && !sceneId.includes('result'))) {
            GameState.choiceCount++;
        }
        els.choiceCount.textContent = GameState.choiceCount + ' 次选择';
    }

    els.storyContainer.innerHTML = '<div class="narrative"><p class="narrative-text">' + scene.narrative + '</p></div>';

    if (scene.npc) {
        els.dialogueSection.classList.remove('hidden');
        els.npcAvatar.textContent = scene.npc.avatar;
        els.npcName.textContent = scene.npc.name;
        els.dialogueContent.innerHTML = '<p class="dialogue-text">' + scene.npc.dialogue + '</p>';
    } else {
        els.dialogueSection.classList.add('hidden');
    }

    renderChoices(scene.choices);
    els.storyContainer.scrollTop = 0;
    saveGame();
}

function renderChoices(choices) {
    els.choicesSection.innerHTML = '';
    if (!choices) return;
    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = '<span class="choice-icon">' + (choice.icon || '➡️') + '</span>' + choice.text;
        btn.style.animationDelay = (index * 0.1) + 's';
        btn.addEventListener('click', () => {
            if (choice.effect) {
                if (GameState.skills[choice.effect.skill] !== undefined) {
                    GameState.skills[choice.effect.skill] = Math.min(5, GameState.skills[choice.effect.skill] + choice.effect.value);
                    updateSkillPanel();
                }
            }
            if (choice.set) {
                Object.assign(GameState, choice.set);
            }
            loadScene(choice.next);
        });
        els.choicesSection.appendChild(btn);
    });
}

function showEnding(endingId, endingsMap) {
    const ending = endingsMap[endingId];
    if (!ending) { console.error('Ending not found:', endingId); return; }

    els.gameScreen.classList.add('hidden');
    els.endingScreen.classList.remove('hidden');

    els.endingRating.textContent = ending.rating;
    els.endingTitle.textContent = ending.title;
    els.endingDesc.textContent = ending.desc;
    els.finalChoices.textContent = GameState.choiceCount;
    els.finalRating.textContent = ending.evaluation;

    ending.achievements.forEach((achievement, index) => {
        if (!GameState.achievements.includes(achievement)) {
            GameState.achievements.push(achievement);
            setTimeout(() => showAchievement(achievement), index * 1500);
        }
    });

    els.progressFill.style.width = '100%';
    saveGame();
}

function showOfficeEnding() {
    const ending = officeEndings['office_final'];
    showEnding('office_final', officeEndings);
}

function showAchievement(name) {
    const achievementIcons = {
        '租房小白': '🌱', '租房达人': '🏠', '适应生活': '🌿', 'DIY达人': '🛠️',
        '布置高手': '🎨', '酒店试睡员': '🛏️', '步行侠': '🚶', '早起鸟': '🌅',
        '品质生活': '💎', '独立宣言': '🚀', '职场新人': '💼', '技术达人': '💻',
        '沟通高手': '🗣️', '适应力强': '🦋'
    };

    els.achievementIcon.textContent = achievementIcons[name] || '🏆';
    els.achievementTitle.textContent = '成就解锁！';
    els.achievementDesc.textContent = name;
    els.achievementPopup.classList.remove('hidden');
    setTimeout(() => els.achievementPopup.classList.add('hidden'), 2500);
}

function shareResult() {
    const title = els.endingTitle.textContent;
    const desc = els.endingDesc.textContent.substring(0, 50) + '...';
    const text = 'AI生活模拟器 - ' + title + '\n' + desc + '\n来试试你的选择！\n' + window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'AI生活模拟器 - ' + title, text: text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(text).then(() => alert('结果已复制到剪贴板！'));
    }
}

function restartGame() {
    const scenario = GameState.currentScenario;
    GameState.currentScene = 'start';
    GameState.choiceCount = 0;
    GameState.history = [];
    GameState.achievements = [];
    GameState.skills = { communication: 0, technical: 0, management: 0, officePolitics: 0 };
    GameState.salary = 0;
    GameState.position = '待业';
    els.endingScreen.classList.add('hidden');
    els.gameScreen.classList.remove('hidden');
    loadScene('start');
}

function backToHome() {
    GameState.currentScenario = null;
    GameState.currentScene = 'start';
    els.endingScreen.classList.add('hidden');
    els.gameScreen.classList.add('hidden');
    els.startScreen.classList.remove('hidden');
    document.body.className = '';
    const logo = els.startScreen.querySelector('.logo-container');
    const btnContainer = els.startScreen.querySelector('.start-btn-container');
    const features = els.startScreen.querySelector('.features');
    if (logo) logo.style.display = '';
    if (btnContainer) btnContainer.style.display = '';
    if (features) features.style.display = '';
    els.scenarioCards.style.display = 'none';
    els.scenarioCards.classList.remove('visible');
}

function saveGame() {
    const saveData = {
        currentScenario: GameState.currentScenario,
        currentScene: GameState.currentScene,
        choiceCount: GameState.choiceCount,
        history: GameState.history,
        achievements: GameState.achievements,
        skills: GameState.skills,
        salary: GameState.salary,
        position: GameState.position,
        companyType: GameState.companyType,
        timestamp: Date.now()
    };
    localStorage.setItem(GameState.saveKey, JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem(GameState.saveKey);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // 不自动恢复，让玩家重新开始
        } catch (e) {
            console.error('Save data corrupted');
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
