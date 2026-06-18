import { Html, Head, Preview, Tailwind, Body, Section, Heading, Text, Hr } from '@react-email/components'

export function AccountDeletionTemplate() {
  return (
    <Html>
      <Head />

      <Preview>Account deleted</Preview>

      <Tailwind>
        <Body className="bg-[#f6f7fb] font-sans">
          <Section className="mx-auto max-w-xl px-6 py-10">
            <Section className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <Heading className="text-2xl font-semibold text-gray-900 tracking-tight">
                Account successfully deleted
              </Heading>

              <Text className="mt-4 text-gray-600 leading-relaxed text-base">
                Your account has been permanently deleted from our system. All associated data has been removed and
                cannot be restored.
              </Text>

              <Hr className="my-8 border-gray-200" />

              <Section>
                <Text className="text-gray-700 text-sm">
                  We’re sorry to see you go. If this was a mistake or you change your mind in the future, you’ll always
                  be welcome back.
                </Text>
              </Section>

              <Text className="mt-6 text-gray-500 text-xs leading-relaxed">Thank you for being with us.</Text>
            </Section>

            <Text className="mt-6 text-center text-xs text-gray-400">
              If you have any questions, contact{' '}
              <a href="mailto:support@skiper.store" className="underline">
                support@skiper.store
              </a>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
