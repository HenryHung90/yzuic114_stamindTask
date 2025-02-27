const calculateExperienceStep = (key: number) => {
  return Math.floor(Math.abs(key - 1) / 6)
}

export {calculateExperienceStep}