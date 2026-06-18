import { Html, Head, Preview, Tailwind, Body, Section, Heading, Text, Link, Hr } from '@react-email/components'
import { SessionMetadata } from 'src/shared/types/session-metadata.types'

interface VerificationEmailProps {
  domain: string
  token: string
  metadata: SessionMetadata
}

export function ResetPassword({ domain, token, metadata }: VerificationEmailProps) {
  const verificationLink = `${domain}/account/new-password/${token}`

  const { location, device, ip } = metadata

  return (
    <Html>
      <Head />

      <Preview>Password reset request</Preview>

      <Tailwind>
        <Body className="bg-[#f6f7fb] font-sans">
          <Section className="mx-auto max-w-xl px-6 py-10">
            <Section className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <Heading className="text-2xl font-semibold text-gray-900 tracking-tight">Reset your password</Heading>

              <Text className="mt-4 text-gray-600 leading-relaxed text-base">
                We received a request to reset your password. You can create a new one using the button below.
              </Text>

              <Section className="mt-8 text-center">
                <Link
                  href={verificationLink}
                  className="inline-block rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white no-underline shadow-md"
                >
                  Reset password
                </Link>
              </Section>

              <Hr className="my-8 border-gray-200" />

              <Section>
                <Heading className="text-sm font-semibold text-gray-900">Security details</Heading>

                <Text className="mt-2 text-xs text-gray-600">
                  <strong>IP:</strong> {ip}
                </Text>

                <Text className="text-xs text-gray-600">
                  <strong>Location:</strong> {location.city}, {location.country}
                </Text>

                <Text className="text-xs text-gray-600">
                  <strong>Device:</strong> {device.browser} on {device.os}
                </Text>
              </Section>

              <Hr className="my-8 border-gray-200" />

              <Text className="text-xs text-gray-500 leading-relaxed">
                If you didn’t request this password reset, you can safely ignore this email. Your account remains
                secure.
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
