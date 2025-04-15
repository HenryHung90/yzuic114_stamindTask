const calculateExperienceStep = (key: number) => {
  return Math.floor(Math.abs(key) / 7)
}

export {calculateExperienceStep}