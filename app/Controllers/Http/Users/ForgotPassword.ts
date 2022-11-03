import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, UserKey } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/ForgotPassword'

export default class ForgotPassword {
  public async store({ request }: HttpContextContract) {
    // pegar email
    const { email, redirectUrl } = await request.validate(StoreValidator)
    const user = await User.findByOrFail('email', email)
    // criar token
    const key = new Date().getTime().toString()
    // salvar token no user do email
    await user.related('keys').create({ key })
    // criar link
    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`
    // enviar email com token no link
    Mail.send((message) => {
      message.to(email),
        message.from('contatofacebook@gmail.com'),
        message.subject('Recuperação de senha'),
        message.htmlView('emails/ForgotPassword', { link })
    })
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    await userKey.load('user')
    
    return userKey.user
    
  }

  public async update({ request, response }: HttpContextContract) {
    // pegar a cheve e a nova senha
    const {key, password} = await request.validate(UpdateValidator)
    // find user with the key
    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail();
    // set new password in the finded user
    await user.merge({password})
    // save user with new password
    await user.save()
    // delete key
    await userKey.delete()

    return response.ok({message: "ok"})
  }
}
