import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ProviderNotificationProps {
  providerName: string
  bookingRef: string
  experienceName: string
  organizerName: string
  organizerEmail: string
  organizerPhone: string
  occasion: string
  groupSize: number
  totalAmount: number
  providerAmount: number
  message: string
  dashboardUrl: string
}

export default function ProviderNotification({
  providerName = 'Théo',
  bookingRef = 'RK-ABC12345',
  experienceName = 'Atelier Cocktail Signature',
  organizerName = 'Sophie Martin',
  organizerEmail = 'sophie@example.com',
  organizerPhone = '06 12 34 56 78',
  occasion = 'EVJF',
  groupSize = 10,
  totalAmount = 550,
  providerAmount = 495,
  message = '',
  dashboardUrl = 'https://resakit.fr/dashboard',
}: ProviderNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Nouvelle réservation {bookingRef} sur ResaKit</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ResaKit</Heading>
          </Section>

          <Section style={heroSection}>
            <Text style={bell}>🔔</Text>
            <Heading style={h1}>Nouvelle réservation !</Heading>
            <Text style={ref}>{bookingRef}</Text>
          </Section>

          <Section style={card}>
            <Text style={greeting}>Bonjour {providerName},</Text>
            <Text style={paragraph}>
              Vous avez une nouvelle réservation confirmée pour{' '}
              <strong>{experienceName}</strong>.
            </Text>

            <Hr style={hr} />

            <Heading style={h2}>Détails de la réservation</Heading>
            <Text style={detail}>
              <strong>Occasion :</strong> {occasion || 'Non précisé'}
            </Text>
            <Text style={detail}>
              <strong>Groupe :</strong> {groupSize} personnes
            </Text>
            <Text style={detail}>
              <strong>Montant total :</strong> {totalAmount.toFixed(2)} €
            </Text>
            <Text style={detail}>
              <strong>Vous recevez :</strong>{' '}
              <span style={{ color: '#059669', fontWeight: 'bold' }}>
                {providerAmount.toFixed(2)} €
              </span>
            </Text>

            <Hr style={hr} />

            <Heading style={h2}>Contact organisateur</Heading>
            <Text style={detail}>
              <strong>Nom :</strong> {organizerName}
            </Text>
            <Text style={detail}>
              <strong>Email :</strong> {organizerEmail}
            </Text>
            {organizerPhone && (
              <Text style={detail}>
                <strong>Téléphone :</strong> {organizerPhone}
              </Text>
            )}

            {message && (
              <>
                <Hr style={hr} />
                <Heading style={h2}>Message de l&apos;organisateur</Heading>
                <div style={messageBox}>
                  <Text style={messageText}>{message}</Text>
                </div>
              </>
            )}

            <div style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Voir dans mon dashboard
              </Button>
            </div>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              ResaKit — Votre partenaire réservation
              <br />
              Des questions ? Répondez à cet email.
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
  backgroundColor: '#ffffff',
}
const bell = { fontSize: '48px', margin: '0 0 15px 0' }
const h1 = { color: '#1a1a1a', fontSize: '26px', fontWeight: 'bold', margin: '0 0 10px 0' }
const h2 = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
}
const ref = { color: '#6b7280', fontSize: '14px', margin: 0 }
const card = { backgroundColor: '#ffffff', padding: '30px', margin: '0 0 20px 0' }
const greeting = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 10px 0',
}
const paragraph = { color: '#4a4a4a', fontSize: '16px', lineHeight: '24px', margin: '0 0 10px 0' }
const hr = { borderColor: '#e6ebf1', margin: '20px 0' }
const detail = { color: '#4a4a4a', fontSize: '14px', margin: '5px 0' }
const messageBox = {
  backgroundColor: '#f9fafb',
  padding: '15px',
  borderRadius: '8px',
  borderLeft: '3px solid #7C3AED',
}
const messageText = { color: '#4a4a4a', fontSize: '14px', fontStyle: 'italic', margin: 0 }
const buttonContainer = { textAlign: 'center' as const, margin: '30px 0 0 0' }
const button = {
  backgroundColor: '#7C3AED',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  padding: '12px 24px',
}
const footer = { padding: '20px 30px', textAlign: 'center' as const }
const footerText = { color: '#8898aa', fontSize: '13px', margin: 0, lineHeight: '20px' }
