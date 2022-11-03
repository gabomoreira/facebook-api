import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/User/Avatar'

export default class MainsController {

    public async update({request, auth}:HttpContextContract) {
        const {file} = await request.validate(UpdateValidator)

        const user = auth.user!

        const avatar = user.related('avatar').firstOrCreate(
            {}, {
                fileCategory: 'avatar',
                fileName: `${new Date().getTime()}.${file.extname}`
            }
        )
    }
}
