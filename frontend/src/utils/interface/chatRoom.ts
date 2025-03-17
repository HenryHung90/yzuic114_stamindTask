interface IMessages {
  time: string
  message: string
  studentId: string
  name: string
  type?: 'User' | 'Other'
}

export type { IMessages }