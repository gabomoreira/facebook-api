import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, UserKey } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/Register'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RegistersController {
  public async store({ request }: HttpContextContract) {
    // se algo der errado no transaction, tudo se desfaz
    await Database.transaction(async (trx) => {
      const { email, redirectUrl } = await request.validate(StoreValidator)

      const user = new User()
      user.useTransaction(trx)
      user.email = email
      await user.save()

      const key = new Date().getTime().toString()
      user.related('keys').create({ key })
      const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

      // envio do email
      await Mail.send((message) => {
        message.to(email),
          message.from('contato@facebook.com', 'Facebook'),
          message.subject('Criação de conta'),
          message.htmlView('emails/Verify-email', { link })
      })
    })
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    const user = await userKey.related('user').query().firstOrFail()

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, name, password } = await request.validate(UpdateValidator)
    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail()

    const username = name.split(' ')[0].toLocaleLowerCase() + new Date().getTime()

    await user.merge({ name, password, username })

    await user.save()

    await userKey.delete()

    return response.ok({ message: 'Ok' })
  }
}
