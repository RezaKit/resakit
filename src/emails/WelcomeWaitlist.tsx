import {
  Body,
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

interface WelcomeWaitlistProps {
  city: string
}

export default function WelcomeWaitlist({ city = 'Toulouse' }: WelcomeWaitlistProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur ResaKit — On arrive bientôt à {city}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ResaKit</Heading>
          </Section>

          <Section style={heroSection}>
            <Text style={emoji}>👋</Text>
            <Heading style={h1}>Bienvenue !</Heading>
            <Text style={subtitle}>Merci de rejoindre l&apos;aventure ResaKit</Text>
          </Section>

          <Section style={card}>
            <Text style={paragraph}>
              On lance bientôt à <strong>{city}</strong> 🚀
            </Text>
            <Text style={paragraph}>Au programme :</Text>
            <ul style={list}>
              <li style={listItem}>🔐 Escape games privatisables</li>
              <li style={listItem}>🍹 Ateliers cocktails & cuisine</li>
              <li style={listItem}>🎯 Expériences insolites de groupe</li>
              <li style={listItem}>💳 Paiement splitté entre participants</li>
            </ul>
            <Text style={paragraph}>
              Fini les Lydia galère entre copines — tout se passe en un clic sur ResaKit.
            </Text>
            <Text style={paragraph}>
              Vous serez parmi les premiers à avoir accès dès le lancement.
            </Text>
            <Text style={signature}>
              L&apos;équipe ResaKit
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              En attendant, suivez-nous :<br />
              <Link href="https://instagram.com/resakit" style={link}>
                @resakit
              </Link>{' '}
              sur Instagram et TikTok
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
  padding: '50px 30px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #7C3AED 0%, #F97316 100%)',
  borderRadius: '0 0 24px 24px',
}
const emoji = { fontSize: '56px', margin: '0 0 15px 0' }
const h1 = { color: '#ffffff', fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0' }
const subtitle = { color: '#ffffff', fontSize: '16px', margin: 0, opacity: 0.95 }
const card = { backgroundColor: '#ffffff', padding: '40px 30px', margin: '20px 0 0' }
const paragraph = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 15px 0',
}
const list = { padding: '0 0 0 5px', margin: '10px 0 20px 0', listStyle: 'none' }
const listItem = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '32px',
  margin: 0,
}
const signature = {
  color: '#7C3AED',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '30px 0 0 0',
}
const footer = { padding: '20px 30px', textAlign: 'center' as const }
const footerText = { color: '#8898aa', fontSize: '13px', margin: 0, lineHeight: '20px' }
const link = { color: '#7C3AED', textDecoration: 'underline', fontWeight: 'bold' }
