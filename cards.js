let cards = [
  {
    id: 'pikemen',
    type: 'attack',
    title: 'Списоносець',
    description: 'Втрачає 1 од. <b>їжі</b><br>Наносить 1 од. <b>шкоди</b>',
    note: 'Відправте своїх воїнів на смерть.',
    play (player, opponent) {
      player.food -= 1
      opponent.health -= 1
    },
  },
  {
    id: 'catapult',
    type: 'attack',
    title: 'Катапульта',
    description: 'Втрачає 2 од. <b>їжі</b><br>Наносить 2 од. <b>шкоди</b>',
    play (player, opponent) {
      player.food -= 2
      opponent.health -= 2
    },
  },
  {
    id: 'trebuchet',
    type: 'attack',
    title: 'Требушет',
    description: 'Втрачає 3 од. <b>їжі</b><br>Бере 1 од. <b>шкоди</b><br>Наносить 4 од. <b>шкоди</b>',
    note: ' &#171;Найкраща машина, яку коли-небудь створила людина!&#187;',
    play (player, opponent) {
      player.food -= 3
      player.health -= 1
      opponent.health -= 4
    },
  },
  {
    id: 'archers',
    type: 'attack',
    title: 'Лучники',
    description: 'Втрачає 3 од. <b>їжі</b><br>Наносить 3 од. <b>шкоди</b>',
    note: '&#171;Готуй свої луки! Приготуватись! Вогонь!&#187;',
    play (player, opponent) {
      player.food -= 3
      opponent.health -= 3
    },
  },
  {
    id: 'knighthood',
    type: 'attack',
    title: 'Лицарі',
    description: 'Втрачає 7 од. <b>їжі</b><br>Наносить 5 од. <b>шкоди</b>',
    note: 'Лицарі можуть бути ще більш широким, ніж їх горе.',
    play (player, opponent) {
      player.food -= 7
      opponent.health -= 5
    },
  },
  {
    id: 'repair',
    type: 'support',
    title: 'Відновлення',
    description: 'Відновлює 5 од. <b>шкоди</b><br>Пропуск наступного ходу',
    play (player, opponent) {
      player.skipTurn = true
      player.health += 5
    }
  },
  {
    id: 'quick-repair',
    type: 'support',
    title: 'Швидке відновлення',
    description: 'Втрачає 3 од. <b>їжі</b><br>Відновлює 3 од. <b>шкоди</b>',
    note: 'Це не без наслідків для моралі та енергії!',
    play (player, opponent) {
      player.food -= 3
      player.health += 3
    }
  },
  {
    id: 'farm',
    type: 'support',
    title: 'Ферма',
    description: 'Збирає 5 од. <b>їжі</b><br>Пропуск наступного ходу',
    note: '&#171;Потрібно бути терплячим, щоб виростити врожай.&#187;',
    play (player, opponent) {
      player.skipTurn = true
      player.food += 5
    },
  },
  {
    id: 'granary',
    type: 'support',
    title: 'Житниця',
    description: 'Збирає 2 од. <b>їжі</b>',
    play (player, opponent) {
      player.food += 2
    }
  },
  {
    id: 'poison',
    type: 'special',
    title: 'Отрута',
    description: 'Втрачає 1 од. <b>їжі</b><br>Опонент втрачає 3 од. <b>їжі</b>',
    note: 'Відправте диверсанта для отруєння фортеці опонента',
    play (player, opponent) {
      player.food -= 1
      opponent.food -= 3
    },
  },
  {
    id: 'fireball',
    type: 'special',
    title: 'Вогняна куля',
    description: 'Бере 3 од. <b>шкоди</b><br>Наносить 5 од. <b>шкоди</b><br>Пропуск наступного ходу',
    note: '&#171;Магія не для дітей. Ти дурень.&#187;',
    play (player, opponent) {
      player.health -= 3
      player.skipTurn = true
      opponent.health -= 5
    },
  },
  {
    id: 'chapel',
    type: 'special',
    title: 'Каплиця',
    description: 'Нічого не робимо',
    note: 'Моліться в каплиці, і сподівайтесь, що хтось послухає.',
    play (player, opponent) {
      // Nothing happens...
    },
  },
  {
    id: 'curse',
    type: 'special',
    title: 'Прокляття!',
    description: 'Для всіх:<br>Втрата 3 од.<b>їжі</b><br>Завдає 3 од. <b>шкоди</b>',
    play (player, opponent) {
      player.food -= 3
      player.health -= 3
      opponent.food -= 3
      opponent.health -= 3
    },
  },
  {
    id: 'miracle',
    type: 'special',
    title: 'Диво!',
    description: 'Для кожного:<br>Збирає 3 од.<b>їжі</b><br>Відновлює 3 од. <b>шкоди</b>',
    play (player, opponent) {
      player.food += 3
      player.health += 3
      opponent.food += 3
      opponent.health += 3
    },
  },
]

cards = cards.reduce((map, card) => {
  card.description = card.description.replace(/\d+\s+<b>.*?<\/b>/gi, '<span class="effect">$&</span>')
  card.description = card.description.replace(/<b>(.*?)<\/b>/gi, (match, p1) => {
    const id = p1.toLowerCase()
    return `<b class="keyword ${id}">${p1} <img src="svg/${id}.svg"/></b>`
  })
  map[card.id] = card
  return map
}, {})

let pile = {
  pikemen: 4,
  catapult: 4,
  trebuchet: 3,
  archers: 3,
  knighthood: 3,
  'quick-repair': 4,
  granary: 4,
  repair: 3,
  farm: 3,
  poison: 2,
  fireball: 2,
  chapel: 2,
  curse: 1,
  miracle: 1,
}
