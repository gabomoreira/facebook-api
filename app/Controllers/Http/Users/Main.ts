import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/User/Main'

export default class MainsController {
    public async show({auth}:HttpContextContract) {
        const user = auth.user!
        return user

    }

    public async update({request, response, auth}:HttpContextContract) {
        const data = await request.validate(UpdateValidator)
        const user = auth.user!
        user.merge(data)
        await user.save()

        return user
    }
}
