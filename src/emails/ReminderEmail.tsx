import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ReminderEmailProps {
  recipientName: string
  experienceName: string
  providerName: string
  address: string
  whatToBring: string
}

export default function ReminderEmail({
  recipientName = 'Sophie',
  experienceName = 'Escape Room Mystery',
  providerName = 'Enigma Toulouse',
  address = '12 rue des Lois, 31000 Toulouse',
  whatToBring = 'Bonne humeur !',
}: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>C&apos;est demain ! Rappel : {experienceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ResaKit</Heading>
          </Section>

          <Section style={heroSection}>
            <Text style={emoji}>⏰</Text>
            <Heading style={h1}>C&apos;est demain !</Heading>
            <Text style={subtitle}>
              Votre expérience {experienceName} est prévue pour demain
            </Text>
          </Section>

          <Section style={card}>
            <Text style={greeting}>Bonjour {recipientName},</Text>
            <Text style={paragraph}>
              Petit rappel amical : votre réservation chez <strong>{providerName}</strong>{' '}
              est prévue demain.
            </Text>

            <div style={infoBox}>
              <Heading style={h2}>📍 Adresse</Heading>
              <Text style={boxText}>{address}</Text>
            </div>

            <div style={infoBox}>
              <Heading style={h2}>🎒 À prévoir</Heading>
              <Text style={boxText}>{whatToBring}</Text>
            </div>

            <div style={tipBox}>
              <Text style={tipText}>
                💡 <strong>Conseil :</strong> Arrivez 10 minutes en avance pour un
                briefing tranquille.
              </Text>
            </div>

            <Text style={paragraph}>
              On vous souhaite un excellent moment ! 🎉
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              ResaKit — resakit.fr
              <br />
              Une question ? Répondez à cet email.
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
const container = { margin: '0 auto', padding: '20px 0', maxWidth: '600px' }
const header = { padding: '20px 30px', borderBottom: '1px solid #e6ebf1' }
const logo = { color: '#7C3AED', fontSize: '28px', fontWeight: 'bold', margin: 0 }
const heroSection = {
  padding: '40px 30px',
  textAlign: 'center' as const,
  backgroundColor: '#fff7ed',
  borderRadius: '0 0 24px 24px',
}
const emoji = { fontSize: '48px', margin: '0 0 15px 0' }
const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}
const subtitle = { color: '#4a4a4a', fontSize: '16px', margin: 0 }
const card = { backgroundColor: '#ffffff', padding: '30px', margin: '20px 0 0' }
const greeting = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 10px 0',
}
const paragraph = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
}
const infoBox = {
  backgroundColor: '#faf5ff',
  padding: '15px 20px',
  borderRadius: '10px',
  margin: '10px 0',
}
const h2 = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 5px 0',
}
const boxText = { color: '#4a4a4a', fontSize: '15px', margin: 0 }
const tipBox = {
  backgroundColor: '#fef3c7',
  padding: '15px 20px',
  borderRadius: '10px',
  margin: '20px 0',
}
const tipText = { color: '#78350f', fontSize: '14px', margin: 0, lineHeight: '20px' }
const footer = { padding: '20px 30px', textAlign: 'center' as const }
const footerText = { color: '#8898aa', fontSize: '13px', margin: 0, lineHeight: '20px' }
