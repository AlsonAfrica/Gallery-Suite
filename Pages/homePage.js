import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Icons
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const { width } = Dimensions.get('window');

export default function HomePage({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');

  const renderNavButton = (routeName, icon, size = 10) => {
    const isActive = activeTab === routeName.toLowerCase();
    return (
      <TouchableOpacity
        style={[styles.navButton, isActive && styles.activeNavButton]}
        onPress={() => {
          setActiveTab(routeName.toLowerCase());
          navigation.navigate(routeName);
        }}
      >
        <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
          {icon(isActive, size)}
        </View>
        <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
          {routeName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#2d3436', '#636e72']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.content}>
          <StatusBar style="light" />
          
          <View style={styles.header}>
            <Text style={styles.title}>Capture</Text>
            <Text style={styles.titleAccent}>Gallery</Text>
          </View>

          <View style={styles.cardsContainer}>
            <BlurView intensity={60} tint="dark" style={styles.statsCard}>
              <Text style={styles.statsTitle}>Recent Activity</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Photos</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Albums</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Places</Text>
                </View>
              </View>
            </BlurView>

            <View style={styles.welcomeCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.welcomeGradient}
              >
                <Text style={styles.welcomeText}>Start Capturing</Text>
                <Text style={styles.welcomeDescription}>
                  Transform your moments into lasting memories
                </Text>
              </LinearGradient>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <BlurView intensity={80} tint="light" style={styles.navBar}>
        {renderNavButton('Gallery',
          (isActive, size) => <MaterialCommunityIcons
            name="view-gallery-outline"
            size={size}
            color={isActive ? '#1a2151' : '#636e72'}
          />
        )}
        {renderNavButton('Camera',
          (isActive, size) => <Entypo
            name="camera"
            size={size}
            color={isActive ? '#1a2151' : '#636e72'}
          />
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2151',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#fff',
    opacity: 0.9,
  },
  titleAccent: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
    marginTop: -10,
  },
  cardsContainer: {
    flex: 1,
    gap: 20,
  },
  statsCard: {
    borderRadius: 25,
    overflow: 'hidden',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  welcomeCard: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
  },
  welcomeGradient: {
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  welcomeDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 85,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 20,
    width: width / 4,
  },
  activeNavButton: {
    backgroundColor: 'rgba(26,33,81,0.1)',
  },
  iconContainer: {
    marginBottom: 4,
    padding: 8,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
  },
  navLabel: {
    fontSize: 12,
    color: '#636e72',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#1a2151',
    fontWeight: '600',
  },
});