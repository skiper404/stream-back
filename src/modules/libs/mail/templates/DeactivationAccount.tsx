import { Html, Head, Preview, Tailwind, Body, Section, Heading, Text, Link, Hr } from '@react-email/components'
import { SessionMetadata } from 'src/shared/types/session-metadata.types'

interface PasswordRecoveryTemplateProps {
  token: string
  metadata: SessionMetadata
}

export function DeactivateTemplate({ token, metadata }: PasswordRecoveryTemplateProps) {
  const { location, device, ip } = metadata

  return (
    <Html>
      <Head />

      <Preview>Account deactivation request</Preview>

      <Tailwind>
        <Body className="bg-[#f6f7fb] font-sans">
          <Section className="mx-auto max-w-xl px-6 py-10">
            <Section className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <Heading className="text-2xl font-semibold text-gray-900 tracking-tight">
                Account deactivation request
              </Heading>

              <Text className="mt-4 text-gray-600 leading-relaxed text-base">
                You initiated a request to deactivate your account. To continue, confirm this action using the code
                below.
              </Text>

              <Section className="mt-8 text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
                <Heading className="text-sm font-semibold text-gray-700">Confirmation code</Heading>

                <Heading className="text-3xl font-bold text-gray-900 mt-2 tracking-widest">{token}</Heading>

                <Text className="text-xs text-gray-500 mt-2">This code is valid for a limited time (5 minutes)</Text>
              </Section>

              <Hr className="my-8 border-gray-200" />

              <Section>
                <Heading className="text-sm font-semibold text-gray-900">Request details</Heading>

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
                If you did not initiate this request, you can safely ignore this email. No changes will be made to your
                account.
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
