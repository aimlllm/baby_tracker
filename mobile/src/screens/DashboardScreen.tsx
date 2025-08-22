import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native'

const DashboardScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>Sarah</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Baby Info */}
        <View style={styles.babyInfo}>
          <Text style={styles.babyTitle}>👶 Emma (2 weeks old)</Text>
          <Text style={styles.babySubtitle}>Last fed 2h 15m ago</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>🍼</Text>
              <Text style={styles.quickActionText}>Feed</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>💤</Text>
              <Text style={styles.quickActionText}>Sleep</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>🚼</Text>
              <Text style={styles.quickActionText}>Diaper</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>🎈</Text>
              <Text style={styles.quickActionText}>Activity</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.scanButton}>
            <Text style={styles.scanButtonText}>📷 Scan Notes</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>🍼</Text>
              <Text style={styles.summaryText}>6 feedings</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>💤</Text>
              <Text style={styles.summaryText}>3 naps</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>🚼</Text>
              <Text style={styles.summaryText}>8 diapers</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>😊</Text>
              <Text style={styles.summaryText}>Happy mood</Text>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activities</Text>
          <View style={styles.activityList}>
            <ActivityItem time="2:30 PM" icon="🍼" description="Formula 4oz" />
            <ActivityItem time="1:45 PM" icon="🚼" description="Diaper change" />
            <ActivityItem time="12:30 PM" icon="💤" description="Nap (45 min)" />
            <ActivityItem time="11:15 AM" icon="🍼" description="Breastfeed (L)" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👶</Text>
          <Text style={styles.navText}>Babies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

interface ActivityItemProps {
  time: string
  icon: string
  description: string
}

const ActivityItem: React.FC<ActivityItemProps> = ({ time, icon, description }) => (
  <View style={styles.activityItem}>
    <Text style={styles.activityIcon}>{icon}</Text>
    <View style={styles.activityContent}>
      <Text style={styles.activityDescription}>{description}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
    <TouchableOpacity style={styles.activityMenu}>
      <Text style={styles.activityMenuText}>⋯</Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  babyInfo: {
    paddingVertical: 24,
  },
  babyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  babySubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  scanButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityMenu: {
    padding: 4,
  },
  activityMenuText: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
  },
  navTextActive: {
    color: '#4F46E5',
    fontWeight: '500',
  },
})

export default DashboardScreen
