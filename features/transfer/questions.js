export const DIMENSIONS = [
  { id: 'interest', name: '对日常任务的兴趣', hint: '不是专业名字好不好听，而是愿不愿意做它的日常。' },
  { id: 'learning', name: '学习方式的适配', hint: '区分暂时基础薄弱与持续不适应。' },
  { id: 'effort', name: '持续投入的意愿', hint: '把重复练习、挫折与长期投入也放进比较。' },
  { id: 'future', name: '未来方向的连接', hint: '比较专业训练与想探索的工作或深造方向。' },
  { id: 'values', name: '个人价值的契合', hint: '看重的东西不同，没有统一的好专业。' },
  { id: 'reality', name: '真实体验的反馈', hint: '依据实际课程、练习或访谈，而不是印象。' },
];

const pairs = [
  ['interest', '没有考试催着，我也愿意多花一点时间了解这个专业的核心问题。'],
  ['interest', '看过它的课程内容后，我能说出至少一项自己想亲手尝试的任务。'],
  ['interest', '比起专业的名气，我更在意它每天具体研究或解决什么问题。'],
  ['interest', '即使拿掉“热门、稳定、好就业”等评价，它的内容仍然吸引我。'],
  ['learning', '它常用的学习方式（阅读、计算、实验、写作等），与我较能投入的方式相符。'],
  ['learning', '面对入门任务时，我能找到自己已经具备、可以继续发展的基础。'],
  ['learning', '遇到不懂的内容，我能通过练习或求助逐渐理解，而不是一直无从下手。'],
  ['learning', '从课程要求看，它需要的基础能力是我愿意逐步补齐的。'],
  ['effort', '除了有趣的部分，我也愿意接受它必要但重复的基本功训练。'],
  ['effort', '即使第一次作业或练习不理想，我仍愿意了解原因并再试一次。'],
  ['effort', '我愿意为它每周留出固定时间，而不只是偶尔有热情。'],
  ['effort', '了解学习难点后，我仍能接受这条学习路径需要的长期投入。'],
  ['future', '我能说明它的具体训练怎样连接到自己想探索的工作或深造方向。'],
  ['future', '它涉及的常见工作任务中，有我愿意进一步体验的内容。'],
  ['future', '即使最理想的去向没有实现，它的其他发展方向也有我愿意了解的选择。'],
  ['future', '对照实际岗位或研究方向的要求，它能帮助我积累相应的基础能力。'],
  ['values', '它常见的成果形式（产品、服务、研究、表达等）能带给我意义感。'],
  ['values', '它的学习与工作内容，符合我自己看重的东西，而不只是他人的期待。'],
  ['values', '了解常见的协作方式与工作环境后，我认为其中有自己能接受的选择。'],
  ['values', '如果向别人介绍自己的学习内容，我愿意具体讲它，而不只是报出专业名称。'],
  ['reality', '亲自做过相关入门任务后，我愿意继续尝试更深入一点的内容。'],
  ['reality', '体验过它不太轻松的部分后，我的兴趣仍然存在。'],
  ['reality', '结合真实课程或作业反馈，我能说清自己的适应之处，而不只是凭感觉。'],
  ['reality', '核对过课程与师生的具体经验后，我对这个专业的期待仍基本成立。'],
];

export const RATINGS = [
  [0, '很不符合'], [1, '较不符合'], [2, '一半符合'], [3, '较符合'], [4, '很符合'], ['unknown', '还不了解 / 未体验'],
];
export const PAIR_QUESTIONS = pairs.map(([dimension, text], i) => ({ id: `pair-${i + 1}`, type: 'pair', dimension, text }));
const opt = (id, label, note = '') => ({ id, label, note });
export const CONTEXT_QUESTIONS = [
  { id: 'targetEvidence', type: 'single', text: '关于目标专业，你已经做到哪一步？', options: [opt('none', '主要听过评价，还没有具体核实'), opt('read', '读过本校培养方案、课程介绍'), opt('talk', '核对过课程，并与在读学生或老师深入交流'), opt('trial', '亲手做过相关课程作业、入门项目或旁听实践', '只看短视频不等于亲身体验。')] },
  { id: 'currentEvidence', type: 'single', text: '你对当前专业的了解，主要来自哪里？', options: [opt('none', '还没接触专业内容，主要是印象'), opt('read', '读过课程安排，但还没真正体验'), opt('trial', '上过相关课程或做过入门练习'), opt('deep', '有一段持续学习经历，也核对过高年级课程')] },
  { id: 'bottleneck', type: 'single', text: '当前让你最想改变的，是什么？', options: [opt('content', '专业核心内容本身不合适'), opt('method', '目前的成绩、学习方法或基础有困难'), opt('environment', '班级、老师、宿舍或学校环境不适应'), opt('unclear', '暂时还说不清')] },
  { id: 'catchup', type: 'single', text: '如果转入后要补修基础课，你准备到哪一步？', options: [opt('plan', '查过差异课程，试过安排补修时间'), opt('willing', '愿意补，但还没有核对具体课程'), opt('hard', '目前难以承担额外课业'), opt('unknown', '不知道是否需要补修')] },
  { id: 'resources', type: 'single', text: '如果转入增加时间或费用，你的现实余量如何？', options: [opt('ready', '已了解大致成本，有可执行安排'), opt('uncertain', '有一定余量，但成本尚未核实'), opt('limited', '余量较紧，需要先解决成本问题'), opt('unknown', '暂时无法判断', '不需要填写家庭收入或具体金额。')] },
  { id: 'motive', type: 'single', text: '如果目标专业不再被称为“热门”，你的想法更接近哪项？', options: [opt('tasks', '我仍想尝试，因为喜欢具体课程和任务'), opt('goal', '先核对它与未来目标的实际联系'), opt('reputation', '我可能会明显犹豫，目前主要看中外部评价'), opt('unknown', '还没想过这个问题')] },
  { id: 'fallback', type: 'single', text: '如果这次没有转成，你准备怎么做？', options: [opt('plan', '已有留在原专业的探索与行动方案'), opt('explore', '愿意了解选修、项目或交叉发展等替代方式'), opt('none', '还没想过备选方案'), opt('deadline', '很焦虑，觉得错过这次就没有别的路')] },
  { id: 'support', type: 'single', text: '对这个决定，你是否有可以讨论或核实信息的人？', options: [opt('yes', '能与老师、家人或相关专业学生具体讨论'), opt('different', '有不同意见，还没把分歧讨论清楚'), opt('alone', '暂时没有，主要自己查资料'), opt('unknown', '不确定应该向谁求助')] },
];
export const QUESTIONS = [...PAIR_QUESTIONS, ...CONTEXT_QUESTIONS];
export const POLICIES = [
  { id: 'eligible', title: '转出、转入资格与限制', prompt: '本人的年级、录取类型、原专业与目标专业，是否符合转出和转入条件？', options: [['yes', '已核实：符合'], ['no', '已核实：不符合'], ['unknown', '未核实']] },
  { id: 'window', title: '申请时间与办理渠道', prompt: '本学年何时申请、在哪里提交？过往通知不能代替当年通知。' },
  { id: 'assessment', title: '名额与选拔方式', prompt: '绩点、排名、笔试、面试等要求是什么？符合条件不等于一定录取。' },
  { id: 'credits', title: '学分认定与补修', prompt: '哪些学分能认，哪些课要补，有没有先修课限制？' },
  { id: 'delay', title: '降级、延毕与费用', prompt: '是否要降级或延长学习年限？相应的时间与费用是多少？' },
  { id: 'postgraduate', title: '推免等后续资格', prompt: '如果在意保研等机会，转入后的资格、排名与认定规则是什么？' },
];
export const POLICY_OPTIONS = [['checked', '已核实'], ['unknown', '未核实'], ['na', '与我无关']];
