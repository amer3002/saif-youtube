import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ExternalLink, Youtube, Users, Video, Eye } from 'lucide-react-native';
import { CHANNEL_INFO } from '@/lib/youtube';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Theme';

export default function AboutScreen() {
  const openChannel = () => {
    Linking.openURL(CHANNEL_INFO.url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Youtube size={56} color={Colors.primary[500]} strokeWidth={2} />
        </View>
        <Text style={styles.appName}>Saif Youtube</Text>
        <Text style={styles.channelName}>{CHANNEL_INFO.name}</Text>
        <Text style={styles.channelArabic}>{CHANNEL_INFO.arabicName}</Text>
        <Text style={styles.channelHandle}>{CHANNEL_INFO.handle}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Video size={22} color={Colors.primary[500]} strokeWidth={2} />
          <View style={styles.cardRowText}>
            <Text style={styles.cardLabel}>Content</Text>
            <Text style={styles.cardValue}>Football gaming videos & shorts</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Users size={22} color={Colors.primary[500]} strokeWidth={2} />
          <View style={styles.cardRowText}>
            <Text style={styles.cardLabel}>Platform</Text>
            <Text style={styles.cardValue}>YouTube</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Eye size={22} color={Colors.primary[500]} strokeWidth={2} />
          <View style={styles.cardRowText}>
            <Text style={styles.cardLabel}>Source</Text>
            <Text style={styles.cardValue}>Live YouTube RSS feed</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.channelButton} activeOpacity={0.85} onPress={openChannel}>
        <ExternalLink size={18} color="#fff" strokeWidth={2} />
        <Text style={styles.channelButtonText}>Visit Channel on YouTube</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>This app displays videos from {CHANNEL_INFO.handle}{'\n'}using the public YouTube RSS feed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark[950],
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.xxxl,
    color: '#fff',
    marginBottom: 4,
  },
  channelName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: FontSize.lg,
    color: Colors.primary[500],
    marginBottom: 2,
  },
  channelArabic: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.xl,
    color: Colors.dark[300],
    marginBottom: 2,
  },
  channelHandle: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.sm,
    color: Colors.dark[400],
  },
  card: {
    width: '100%',
    backgroundColor: Colors.dark[800],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardRowText: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.xs,
    color: Colors.dark[400],
    marginBottom: 2,
  },
  cardValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: FontSize.md,
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark[700],
    marginVertical: Spacing.md,
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  channelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: FontSize.md,
    color: '#fff',
  },
  footer: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.xs,
    color: Colors.dark[500],
    textAlign: 'center',
    lineHeight: 18,
  },
});
