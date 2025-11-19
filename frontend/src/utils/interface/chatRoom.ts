interface IMessages {
  taskId?: string
  time: string
  message: string
  studentId: string
  name: string
  type?: 'User' | 'Other' | 'Waiting'
}

export type { IMessages }
