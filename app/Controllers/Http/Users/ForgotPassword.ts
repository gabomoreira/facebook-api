import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, UserKey } from 'App/Models'
import { StoreValidator } from 'App/Validators/User/ForgotPassword'

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

  public async show({ params }: HttpContextContract) {}

  public async update({ request }: HttpContextContract) {}
}
