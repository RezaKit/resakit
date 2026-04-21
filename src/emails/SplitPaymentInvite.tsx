import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface SplitPaymentInviteProps {
  organizerName: string
  experienceName: string
  occasion: string
  date: string
  amount: number
  paymentUrl: string
  deadline: string
}

export default function SplitPaymentInvite({
  organizerName = 'Sophie',
  experienceName = 'Escape Room Mystery',
  occasion = 'EVJF',
  date = new Date().toISOString(),
  amount = 25,
  paymentUrl = 'https://resakit.fr/join/ABC123',
  deadline = new Date().toISOString(),
}: SplitPaymentInviteProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {organizerName} t&apos;invite à {experienceName} 🎉
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ResaKit</Heading>
          </Section>

          <Section style={heroSection}>
            <Text style={emoji}>🎉</Text>
            <Heading style={h1}>Tu es invité(e) !</Heading>
            <Text style={subtitle}>
              <strong>{organizerName}</strong> organise {occasion} et t&apos;invite à{' '}
              <strong>{experienceName}</strong>
            </Text>
          </Section>

          <Section style={card}>
            <Text style={paragraph}>
              Pour confirmer ta place, il te suffit de régler ta part via un paiement
              sécurisé. C&apos;est rapide et simple.
            </Text>

            <div style={amountBox}>
              <Text style={amountLabel}>Ta part</Text>
              <Text style={amountValue}>{amount.toFixed(2)} €</Text>
            </div>

            <div style={buttonContainer}>
              <Button style={button} href={paymentUrl}>
                Payer ma part →
              </Button>
            </div>

            <Text style={smallText}>
              💳 Paiement sécurisé par Stripe
              <br />
              🔒 ResaKit ne stocke jamais tes coordonnées bancaires
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Tu ne connais pas ResaKit ?<br />
              <Link href="https://resakit.fr" style={link}>
                Découvre la plateforme
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif',
}
const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
}
const header = {
  padding: '20px 30px',
  borderBottom: '1px solid #e6ebf1',
}
const logo = {
  color: '#7C3AED',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: 0,
}
const heroSection = {
  padding: '50px 30px 40px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #7C3AED 0%, #F97316 100%)',
  borderRadius: '0 0 24px 24px',
}
const emoji = { fontSize: '56px', margin: '0 0 20px 0' }
const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
}
const subtitle = {
  color: '#ffffff',
  fontSize: '18px',
  lineHeight: '26px',
  margin: 0,
  opacity: 0.95,
}
const card = {
  backgroundColor: '#ffffff',
  padding: '40px 30px',
  margin: '20px 0',
  borderRadius: '12px',
  textAlign: 'center' as const,
}
const paragraph = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 30px 0',
}
const amountBox = {
  backgroundColor: '#faf5ff',
  padding: '30px',
  borderRadius: '16px',
  margin: '0 0 30px 0',
}
const amountLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 5px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}
const amountValue = {
  color: '#7C3AED',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: 0,
  lineHeight: '1',
}
const buttonContainer = { textAlign: 'center' as const, margin: '0 0 20px 0' }
const button = {
  backgroundColor: '#F97316',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  padding: '16px 40px',
}
const smallText = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '20px 0 0 0',
  lineHeight: '20px',
}
const footer = { padding: '20px 30px', textAlign: 'center' as const }
const footerText = { color: '#8898aa', fontSize: '13px', margin: 0 }
const link = { color: '#7C3AED', textDecoration: 'underline' }
