import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { FileCategory } from 'App/Utils'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fileCategory: FileCategory

  @column()
  public ownerId: number

  @column()
  public fileName: string
}
