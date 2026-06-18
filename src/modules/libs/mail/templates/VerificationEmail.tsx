import { Html, Head, Preview, Tailwind, Body, Section, Heading, Text, Link, Hr } from '@react-email/components'

interface VerificationEmailProps {
  domain: string
  token: string
}

export function VerificationEmail({ domain, token }: VerificationEmailProps) {
  const verificationLink = `${domain}/account/verify/${token}`

  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>

      <Tailwind>
        <Body className="bg-[#f6f7fb] font-sans">
          <Section className="mx-auto max-w-xl px-6 py-10">
            <Section className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <Heading className="text-2xl font-semibold text-gray-900 tracking-tight">Confirm your email</Heading>

              <Text className="mt-4 text-gray-600 leading-relaxed text-base">
                Thanks for signing up. To activate your account, confirm your email address by clicking the button
                below.
              </Text>

              <Section className="mt-8 text-center">
                <Link
                  href={verificationLink}
                  className="inline-block rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white no-underline shadow-md  bg-indigo-700"
                >
                  Verify email
                </Link>
              </Section>

              <Hr className="my-8 border-gray-200" />

              <Text className="text-xs text-gray-500 leading-relaxed">
                If you didn’t create this account, you can safely ignore this email.
              </Text>
            </Section>

            <Text className="mt-6 text-center text-xs text-gray-400">
              Need help? Contact{' '}
              <Link href="mailto:support@skiper.store" className="underline">
                support@skiper.store
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
