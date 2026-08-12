const personas = {
  homebody: { name: '思乡者', englishName: 'The Homesick Homie', image: './src/assets/personas/homebody.jpg', color: '#44a77c', trait: '旅行是为了确认：家门口那碗面，确实有点东西。', reason: '你对风景保持礼貌，对回家保持执着。导航显示“距酒店 2.3km”时，你的灵魂已经提前进入待机模式。' },
  hotel: { name: '躺平仙人', englishName: 'The Hotel VVVVIP', image: './src/assets/personas/hotel.jpg', color: '#8766ed', trait: '换个城市睡觉，也是一种高级移动。', reason: '你订海景房不是为了看海，是为了让海看着你睡满 12 小时。行程表在你眼里，主要起催眠作用。' },
  special: { name: '特种兵王', englishName: 'The Special Forces King', image: './src/assets/personas/special.jpg', color: '#c95d35', trait: '日行三万步只是热身；“累”字不在字典里。', reason: '你不是在旅行，你是在用双脚给城市做压力测试。凌晨四点看日出，下午四点还能问大家要不要再加一个点。' },
  infant: { name: '婴幼儿', englishName: 'The Giant Infant', image: './src/assets/personas/infant.jpg', color: '#7699cc', trait: '主打无脑跟随，5000 步后自动发出哀嚎。', reason: '你是团队里最诚实的电量提示器：导航看不懂没关系，只要有人告诉你“还有多久”和“吃什么”。' },
  lost: { name: '失物招领者', englishName: 'The Walking Lost & Found', image: './src/assets/personas/lost.jpg', color: '#ec7b50', trait: '旅行主线：找手机、找房卡、找刚才还在手里的东西。', reason: '你不是丢三落四，你是在给旅程埋彩蛋。每到一座城，都能用一句“我东西呢？”重新认识当地人。' },
  shopper: { name: '购物狂魔', englishName: 'The Big Spender', image: './src/assets/personas/shopper.jpg', color: '#e35679', trait: '每个城市都值得买特产，行李箱会为此进化。', reason: '你看到的不是冰箱贴，是一个城市对你的深情挽留。箱子膨胀不是超重，是纪念意义的物理显形。' },
  foodie: { name: '美食雷达', englishName: 'The Foodie Radar', image: './src/assets/personas/foodie.jpg', color: '#f2a224', trait: '景点负责出片，餐厅负责让旅程有意义。', reason: '你的胃拥有独立外交权。为了巷口那家苍蝇馆子跨越半个城市？这不是绕路，这是朝圣。' },
  night: { name: '夜生活之王', englishName: 'The Nightlife King', image: './src/assets/personas/night.jpg', color: '#4d66d7', trait: '白天是充电时间，晚上才开始感受城市脉搏。', reason: '当别人说“早点回去休息”，你听见的是城市在对你发出第二次邀请。凌晨两点，才是你的上午。' },
  director: { name: '纪录片导演', englishName: 'The Director', image: './src/assets/personas/director.jpg', color: '#a17134', trait: '亲眼看景十秒，剩下时间全在镜头里。', reason: '你的行李箱里住着补光灯和三脚架。朋友以为自己在旅行，实际已经无意间参演了你的传世之作。' },
  social: { name: '社牛天花板', englishName: 'The Social Butterfly', image: './src/assets/personas/social.jpg', color: '#e86a49', trait: '出租车司机、民宿老板、路边摊主都是新朋友。', reason: '你在异国他乡也能靠三句外语和肢体语言聊成常客。旅行结束时，通讯录比相册长。' },
  vibe: { name: '修行者', englishName: 'The Vibe Seeker', image: './src/assets/personas/vibe.jpg', color: '#2d8d9a', trait: '人潮之外，才有真正的旅行信号。', reason: '你对网红景点保持警觉，对无名小巷满怀信仰。别人收集打卡照，你收集“这里磁场很对”的证词。' },
}

const questions = [
  { title: '落地后的第一小时，你最想做什么？', options: [
    ['先把酒店床试睡一遍', ['hotel', 'infant']], ['背包出发，城市必须被征服', ['special', 'director']], ['冲去本地小馆，顺便侦察夜市', ['foodie', 'night']],
  ] },
  { title: '你收拾行李的核心原则是？', options: [
    ['相机、补光灯、三脚架，一个都不能少', ['director', 'social']], ['带空箱出门，装满纪念品回家', ['shopper', 'lost']], ['带上拖鞋，以及回家的念想', ['homebody', 'hotel']],
  ] },
  { title: '一行人站在陌生路口，你会？', options: [
    ['你们决定就好，我都行', ['infant', 'lost']], ['问问路人，三分钟后已经互关', ['social', 'vibe']], ['直接选最陡那条，快走！', ['special', 'night']],
  ] },
  { title: '旅行预算最容易花在哪？', options: [
    ['巷子里那家“不吃等于白来”的馆子', ['foodie', 'homebody']], ['一眼看起来就很有纪念意义的东西', ['shopper', 'lost']], ['为了找一处没人的荒野，多打了一小时车', ['vibe', 'director']],
  ] },
  { title: '夜幕降临，城市正在切换模式。你？', options: [
    ['去酒吧、夜市，今晚才刚开始', ['night', 'social']], ['守在山顶或巷口，等一束对的光', ['vibe', 'special']], ['回酒店充电，明天再说', ['hotel', 'infant']],
  ] },
]

const root = document.getElementById('root')
const personaKeys = Object.keys(personas)
let step = 0
let answers = []

function resultKey() {
  const scores = Object.fromEntries(personaKeys.map((key) => [key, 0]))
  answers.forEach((answer, questionIndex) => {
    answer.scores.forEach((key, index) => { scores[key] += index === 0 ? 3 : 1 })
    scores[answer.scores[0]] += questionIndex % 2
  })
  return personaKeys.reduce((winner, key) => scores[key] > scores[winner] ? key : winner, personaKeys[0])
}

function renderQuiz() {
  const question = questions[step]
  const dots = questions.map((_, index) => `<span class="progress-dot ${index <= step ? 'active' : ''}"></span>`).join('')
  const options = question.options.map(([label, scores], index) => `
    <button class="answer" data-index="${index}">
      <span class="answer-index">0${index + 1}</span><span>${label}</span><span class="answer-arrow" aria-hidden="true">↗</span>
    </button>`).join('')
  const strip = personaKeys.map((key) => `<img src="${personas[key].image}" alt="" />`).join('')
  root.innerHTML = `<main class="app-shell quiz-shell">
    <section class="quiz-stage">
      <div class="top-row"><div class="brand">旅行人格局 <span>TRAVEL ARCHETYPE</span></div><span class="question-count">0${step + 1} / 0${questions.length}</span></div>
      <div class="progress" aria-label="第 ${step + 1} 题，共 ${questions.length} 题">${dots}</div>
      <div class="question-copy"><p>凭直觉选择，不许和导游商量。</p><h1>${question.title}</h1></div>
      <div class="answers">${options}</div><p class="quiz-footnote">5 道题，认领你的旅行英雄。</p>
    </section><aside class="image-strip" aria-hidden="true">${strip}</aside>
  </main>`
  root.querySelectorAll('.answer').forEach((button) => button.addEventListener('click', () => {
    const [label, scores] = question.options[Number(button.dataset.index)]
    answers.push({ label, scores })
    if (step === questions.length - 1) renderResult()
    else { step += 1; renderQuiz() }
  }))
}

function renderResult() {
  const result = personas[resultKey()]
  root.innerHTML = `<main class="app-shell result-shell" style="--accent:${result.color}">
    <section class="result-stage">
      <div class="brand">旅行人格局 <span>TRAVEL ARCHETYPE</span></div>
      <p class="result-label">你的旅行人格是</p><h1>${result.name}</h1><p class="english-name">${result.englishName}</p>
      <div class="result-photo-wrap"><img src="${result.image}" alt="${result.name} 旅行人格" class="result-photo" /></div>
      <p class="result-trait">${result.trait}</p><div class="reason-box"><span>为什么是你</span><p>${result.reason}</p></div>
      <button class="restart-button">再测一次</button>
    </section><p class="fine-print">仅供旅行欢乐参考。行李请自行看管。</p>
  </main>`
  root.querySelector('.restart-button').addEventListener('click', () => { step = 0; answers = []; renderQuiz() })
}

renderQuiz()
