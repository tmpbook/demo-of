export let stateHash = {
  1: {text: '打通中', type: 'primary'},
  2: {text: '专线实施中', type: 'default'},
  3: {text: '接入完成', type: 'success'},
  4: {text: '暂停', type: 'danger'},
  0: {text: 'NaN', type: 'danger'}
}

export let optionStateHash = [
  {
    label: '打通中',
    value: 1
  },
  {
    label: '专线实施中',
    value: 2
  },
  {
    label: '接入完成',
    value: 3
  },
  {
    label: '暂停',
    value: 4
  },
  {
    label: 'NaN',
    value: 0
  }
]

export let connTypeHash = {
  1: '客户直签运营商',
  2: 'UCloud代签运营商',
  3: '其他'
}

export let optionConnTypeHash = [
  {
    label: '客户直签运营商',
    value: 1
  },
  {
    label: 'UCloud代签运营商',
    value: 2
  },
  {
    label: '其他',
    value: 3
  }
]
