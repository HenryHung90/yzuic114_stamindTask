export enum EGroupType {
  NONE = 'NONE',
  EXPERIMENTAL = 'EXPERIMENTAL',
  CONTROL = 'CONTROL'
}



function calculateTimer(startTime: number){
  return Math.floor((Date.now() - startTime) / 1000).toString()
}

export {calculateTimer}