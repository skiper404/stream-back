/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Logger } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'argon2'
import 'dotenv/config'
import { Prisma, PrismaClient } from 'generated/prisma/client'
import { categoriesData, streamTitles, usernames } from 'src/shared/constants/seed-data'

const adapter = new PrismaPg({
  connectionString:
    'postgresql://neondb_owner:npg_DUmtxpQ28zIc@ep-square-boat-at1944g9-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=full&channel_binding=require'
})

const prisma = new PrismaClient({
  adapter,
  transactionOptions: {
    maxWait: 5000,
    timeout: 10000,
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  }
})

async function drop() {
  try {
    Logger.log('Deleting databases...')

    await prisma.$transaction(async (tx) => {
      await tx.user.deleteMany()
      await tx.socialLink.deleteMany()
      await tx.stream.deleteMany()
      await tx.category.deleteMany()
    })

    Logger.log('Deleting databases completed')
  } catch (error) {
    Logger.error(error)
    throw new BadRequestException('Error deleting database')
  } finally {
    Logger.log('Close connection with database')
    await prisma.$disconnect()
    Logger.log('Connection successfull closed')
  }
}

async function main() {
  try {
    Logger.log('Deleting databases...')

    await prisma.$transaction(async (tx) => {
      await tx.user.deleteMany()
      await tx.socialLink.deleteMany()
      await tx.stream.deleteMany()
      await tx.category.deleteMany()
    })

    Logger.log('Deleting databases completed')

    Logger.log('Creating databases...')

    await prisma.category.createMany({ data: categoriesData })

    Logger.log('Categories successfully created')

    const categories = await prisma.category.findMany()

    const categoriesBySlug = Object.fromEntries(categories.map((category) => [category.slug, category]))

    await prisma.$transaction(async (tx) => {
      for (const username of usernames) {
        const randomCategory =
          categoriesBySlug[
            Object.keys(categoriesBySlug)[Math.floor(Math.random() * Object.keys(categoriesBySlug).length)]
          ]

        const userExist = await tx.user.findUnique({
          where: { username }
        })

        if (!userExist) {
          const createdUser = await tx.user.create({
            data: {
              email: `${username}@skiper-stream.com`,
              password: await hash('12341234'),
              username,
              avatar: `/channels/${username}.png`,
              isEmailVerified: true
            }
          })

          const randomTitles = streamTitles[randomCategory.slug]

          const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)]

          await tx.stream.create({
            data: {
              title: randomTitle,
              thumbnailUrl: `/streams/${createdUser.username}.png`,
              user: { connect: { id: createdUser.id } },
              category: { connect: { id: randomCategory.id } }
            }
          })
        }
      }
    })

    Logger.log('Databases successfully created')
  } catch (error) {
    Logger.error(error)
    throw new BadRequestException('Error creating databases')
  } finally {
    await prisma.$disconnect()
    Logger.log('Close connection with database')
  }
}

void drop()
// void main()
