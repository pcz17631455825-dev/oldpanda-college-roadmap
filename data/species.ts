import type { Faction, HollandKey, ValueKey } from "@/types";
export interface Species { id:string; name:string; emoji:string; faction:Faction|"中立"; description:string; catchphrase:string; behavior:string; conservationStatus:"无危"|"易危"|"濒危"|"极危"; matchRules:{faction?:Faction;high?:(HollandKey|ValueKey)[];low?:(HollandKey|ValueKey)[]} }
const s=(id:string,name:string,emoji:string,faction:Species["faction"],description:string,catchphrase:string,behavior:string,conservationStatus:Species["conservationStatus"],matchRules:Species["matchRules"]):Species=>({id,name,emoji,faction,description,catchphrase,behavior,conservationStatus,matchRules});
export const species:Species[]=[
s("sloth","摆烂树袋熊","🦥","中立","不是不努力，只是你的能量条正在缓慢加载。先把下一步想清楚，慢一点也能走到自己的树枝上。","让我再想五分钟……","擅长把待办事项养成电子宠物。","易危",{}),
s("owl","焦虑猫头鹰","🦉","中立","你能把五年后的天气都提前查好。焦虑不是超能力，但这份认真值得换成一份可执行的小计划。","要是万一呢？","凌晨两点还在搜索专业就业率。","易危",{}),
s("panda","卷王大熊猫","🐼","升学派","竹子要最新鲜的，课表要最满的。你享受掌握新知识的过程，也别忘了给自己留一点发呆的缝隙。","这题我再推一遍。","开学第一周就整理完四年考证清单。","无危",{faction:"升学派",high:["achievement","I"]}),
s("otter","论文水獭","🦦","升学派","表面在玩水，脑子里已经把问题拆成了三个研究方向。好奇心是你的发动机。","这个现象很有意思。","吃饭时也会突然打开文献库。","无危",{faction:"升学派",high:["I"]}),
s("peacock","作品孔雀","🦚","升学派","你的灵感需要舞台，也愿意为了一个更好的作品反复打磨。把表达变成可积累的能力吧。","我有个更酷的想法。","PPT最后一页永远比第一版好看十倍。","无危",{faction:"升学派",high:["A"]}),
s("ant","考证小蚂蚁","🐜","升学派","你不迷信捷径，只信每天搬一小粒米。长期主义在你身上不是口号，是一张密密麻麻的日历。","今天的份额完成了吗？","所有资料都有编号和备份。","无危",{faction:"升学派",high:["C"]}),
s("fox","机会狐狸","🦊","就业派","你闻得到机会，也知道什么时候该转弯。你不是功利，只是希望能力能在真实世界快速产生回音。","这个赛道有空间。","能在聊天里自然问出行业真实情况。","无危",{faction:"就业派",high:["income","E"]}),
s("cheetah","实习猎豹","🐆","就业派","还没入学，你已经在研究大二暑期实习。你的速度很珍贵，但记得选方向比盲目加速更重要。","机会来了就冲。","简历里项目经历比朋友圈内容多。","易危",{faction:"就业派",high:["income"]}),
s("beaver","项目河狸","🦫","就业派","你相信真本事要落在看得见的成果上。需求、分工、复盘，都是你把愿望搭成桥的材料。","先做个能跑的版本。","小组作业一开始就建好项目看板。","无危",{faction:"就业派",high:["R","C"]}),
s("parrot","社牛鹦鹉","🦜","就业派","你有把陌生人聊成队友的本事。表达是天赋，倾听和兑现承诺会让它更有分量。","你好呀，认识一下！","刚进群十分钟就知道谁负责什么。","无危",{faction:"就业派",high:["E","S"]}),
s("turtle","稳稳海龟","🐢","体制派","你不怕走得慢，只怕走得虚。稳定感对你不是束缚，而是能安心扎根、持续积累的土壤。","先把基本盘守住。","做选择前会默默列出三套备选方案。","无危",{faction:"体制派",high:["stability","C"]}),
s("elephant","责任大象","🐘","体制派","你记得住承诺，也扛得起事情。公共服务和长期协作场景，会让你的可靠成为别人安心的来源。","交给我，放心。","总是最后一个确认大家有没有安全到家。","易危",{faction:"体制派",high:["S","social"]}),
s("crane","上岸白鹤","🦢","体制派","你的目光很长，愿意为一条清晰的路径耐心蓄力。把上岸拆成一个个今天能完成的小动作。","方向对了，慢也是快。","收藏夹里有一整套考试公告。","无危",{faction:"体制派",high:["achievement","stability"]}),
s("cat","自由小猫","🐈","中立","你需要一点自己的空间，才会长出最好的状态。自由不是逃避，而是知道自己要如何安排生活。","我想按自己的节奏来。","会为一个兴趣跨城看展或上课。","无危",{high:["freedom","A"]}),
s("dolphin","共情海豚","🐬","中立","你很容易捕捉到别人没说出口的情绪。请把这份细腻用在连接人，也用在照顾自己上。","我好像懂你的意思。","群聊里最常出现的一句是你还好吗。","无危",{high:["S","social"]}),
s("raccoon","探索浣熊","🦝","中立","世界对你来说像一只没上锁的工具箱。好奇会带你打开许多门，记得也练习把一扇门推深。","这个我能试试吗？","桌面上同时摆着三种没做完的小实验。","无危",{high:["I","R"]})];
