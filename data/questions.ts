import type { Question } from "@/types";
const q = (id: number, type: Question["type"], category: Question["category"], text: string, options: Question["options"]): Question => ({ id, type, category, text, options });
export const questions: Question[] = [
q(1,"single","holland","一门完全由你选择的课，你最想学什么？",[{label:"拆解机器、做出能动手的东西",scores:{R:3}},{label:"追一个问题，做实验找答案",scores:{I:3}},{label:"写故事、设计作品或拍视频",scores:{A:3}}]),
q(2,"single","holland","同学遇到难题时，你更像哪一种队友？",[{label:"耐心听他讲，陪他把情绪理顺",scores:{S:3}},{label:"站出来组织大家，推动事情发生",scores:{E:3}},{label:"列清单、排步骤，确保不漏一项",scores:{C:3}}]),
q(3,"multiple","holland","哪些活动会让你进入“忘记时间”状态？（可多选）",[{label:"修理、搭建、实地操作",scores:{R:2}},{label:"分析数据、解题、阅读研究",scores:{I:2}},{label:"创作内容、审美表达",scores:{A:2}},{label:"辅导别人、协作服务",scores:{S:2}}]),
q(4,"single","holland","面对一份陌生任务，你的第一反应是？",[{label:"先上手试试，边做边改",scores:{R:2}},{label:"先查资料，弄懂原理再说",scores:{I:2}},{label:"先想想能不能做得与众不同",scores:{A:2}}]),
q(5,"single","holland","你最认可的成就感来自哪里？",[{label:"帮助一个具体的人变得更好",scores:{S:3,social:1}},{label:"带领团队拿下一个目标",scores:{E:3,achievement:1}},{label:"把复杂的事情安排得井井有条",scores:{C:3,stability:1}}]),
q(6,"multiple","holland","下列描述哪些更像你？（可多选）",[{label:"我在意工具和技术能不能真正解决问题",scores:{R:2,I:1}},{label:"我喜欢用观点和作品表达自己",scores:{A:2}},{label:"我对人的动机和关系很感兴趣",scores:{S:2}},{label:"我乐于说服、谈判和拿结果",scores:{E:2}}]),
q(7,"single","values","选专业时，你最不愿妥协的是？",[{label:"未来路径稳定、抗波动",scores:{stability:3}},{label:"能持续精进，往更高平台走",scores:{achievement:3}},{label:"起步收入和成长上限",scores:{income:3}}]),
q(8,"single","values","理想工作的一个关键词是？",[{label:"确定：节奏可预期，生活有底",scores:{stability:2}},{label:"挑战：不断升级打怪",scores:{achievement:2}},{label:"回报：能力直接兑现价值",scores:{income:2}},{label:"自主：可以按自己的方式做",scores:{freedom:2}}]),
q(9,"single","values","如果毕业时只有一个机会，你会优先选？",[{label:"有培养体系的稳定岗位",scores:{stability:3}},{label:"读研深造，换一个更高的起点",scores:{achievement:3}},{label:"成长快、薪酬高的行业机会",scores:{income:3}}]),
q(10,"multiple","values","你希望大学四年收获什么？（可多选）",[{label:"扎实专业能力",scores:{achievement:2}},{label:"实习、项目和行业人脉",scores:{income:2,E:1}},{label:"考证、备考和可迁移的稳定能力",scores:{stability:2,C:1}},{label:"更广的视野与自由探索",scores:{freedom:2,A:1}}]),
q(11,"single","personality","一个高压力的截止日临近，你会？",[{label:"默默拆分任务，按表推进",scores:{C:2,stability:1}},{label:"找伙伴分工，一起把气氛拉起来",scores:{S:2,E:1}},{label:"先抓最关键处，想一条新路",scores:{I:1,A:2}}]),
q(12,"single","personality","你更愿意生活在怎样的城市与工作场景？",[{label:"有产业机会、变化快的大城市",scores:{income:2,E:1}},{label:"秩序稳定、公共服务完善的城市",scores:{stability:2,social:1}},{label:"高校或研究机构附近的学习氛围",scores:{achievement:2,I:1}}]),
q(13,"single","holland","看到一个社会热点，你最可能做什么？",[{label:"追溯数据和事实，自己判断",scores:{I:3}},{label:"把它做成有感染力的图文或视频",scores:{A:3}},{label:"思考能为哪些人提供帮助",scores:{S:3}}]),
q(14,"single","values","家人期待与你的想法不完全一致时，你更看重？",[{label:"现实可行与长期稳定",scores:{stability:2}},{label:"把目标做大，争取更好的平台",scores:{achievement:2}},{label:"保持选择空间，自己承担结果",scores:{freedom:2,income:1}}]),
q(15,"multiple","holland","哪些任务你愿意反复练习，直到很熟？（可多选）",[{label:"实验、编程或精密操作",scores:{R:2,I:2}},{label:"演讲、策划、商业沟通",scores:{E:2}},{label:"表格、流程、规范和细节",scores:{C:2}},{label:"课堂、咨询、陪伴和服务",scores:{S:2}}]),
q(16,"single","values","你希望自己的工作最终带来什么？",[{label:"成为一个领域里很专业的人",scores:{achievement:2,I:1}},{label:"改善身边人的生活或公共事务",scores:{social:3,stability:1}},{label:"获得更充足的经济回报与选择",scores:{income:3}}])
];
