import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '../../App'

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF2FF" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Logo and Title */}
        <View style={styles.logoSection}>
          <Text style={styles.logoIcon}>🍼</Text>
          <Text style={styles.title}>Baby Tracker</Text>
          <Text style={styles.subtitle}>
            Track your baby's journey{'\n'}with intelligent AI
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem text="Easy activity logging" />
          <FeatureItem text="Smart photo scanning" />
          <FeatureItem text="Beautiful growth insights" />
          <FeatureItem text="Works offline anywhere" />
        </View>

        {/* Authentication Buttons */}
        <View style={styles.authButtons}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <View style={styles.socialIcon}>
              <Text style={styles.socialIconText}>G</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
            <View style={[styles.socialIcon, styles.appleIcon]}>
              <Text style={styles.appleBadge}>🍎</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.socialButton, styles.emailButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <View style={[styles.socialIcon, styles.emailIcon]}>
              <Text style={styles.emailBadge}>📧</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Email</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View style={styles.signInSection}>
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text 
              style={styles.signInLink}
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

interface FeatureItemProps {
  text: string
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureBullet}>•</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  helpButton: {
    padding: 8,
  },
  helpText: {
    color: '#6B7280',
    fontSize: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureBullet: {
    color: '#10B981',
    fontSize: 18,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    color: '#374151',
    fontSize: 16,
  },
  authButtons: {
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButton: {},
  appleButton: {},
  emailButton: {},
  socialIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#3B82F6',
  },
  appleIcon: {
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  emailIcon: {
    backgroundColor: '#6B7280',
    borderRadius: 4,
  },
  socialIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appleBadge: {
    fontSize: 12,
  },
  emailBadge: {
    fontSize: 10,
  },
  socialButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  signInSection: {
    alignItems: 'center',
  },
  signInText: {
    color: '#6B7280',
    fontSize: 16,
  },
  signInLink: {
    color: '#4F46E5',
    fontWeight: '500',
  },
})

export default WelcomeScreen
