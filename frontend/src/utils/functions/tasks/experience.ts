const calculateExperienceStep = (key: number) => {
  return Math.floor(Math.abs(key - 1) / 7)
}

export {calculateExperienceStep}