import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ArrowLeft, Eye, Heart, Calendar } from 'lucide-react-native';
import { VideoItem } from '@/types/video';
import { fetchVideos, formatViews, formatDate, CHANNEL_INFO } from '@/lib/youtube';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Theme';

export default function PlayerScreen() {
  const { videoId, title } = useLocalSearchParams<{ videoId: string; title: string }>();
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const videos = await fetchVideos();
        const found = videos.find((v) => v.videoId === videoId);
        if (found) setVideo(found);
      } catch (e) {
        // metadata is optional - player still works
      } finally {
        setLoading(false);
      }
    })();
  }, [videoId]);

  const embedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #000; overflow: hidden; }
          .container { position: relative; width: 100%; height: 100vh; }
          iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowfullscreen
            frameborder="0"
          ></iframe>
        </div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <WebView
          source={{ html: embedHtml }}
          style={styles.webview}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.webviewLoading}>
              <ActivityIndicator size="large" color={Colors.primary[500]} />
            </View>
          )}
        />
      </View>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.videoTitle}>{title || video?.title || 'Video'}</Text>
        <View style={styles.metaRow}>
          {video && (
            <>
              <View style={styles.metaItem}>
                <Eye size={14} color={Colors.dark[400]} strokeWidth={2} />
                <Text style={styles.metaText}>{formatViews(video.views)}</Text>
              </View>
              {video.likes > 0 && (
                <View style={styles.metaItem}>
                  <Heart size={14} color={Colors.dark[400]} strokeWidth={2} />
                  <Text style={styles.metaText}>{video.likes}</Text>
                </View>
              )}
              <View style={styles.metaItem}>
                <Calendar size={14} color={Colors.dark[400]} strokeWidth={2} />
                <Text style={styles.metaText}>{formatDate(video.publishedDate)}</Text>
              </View>
            </>
          )}
          {loading && !video && (
            <ActivityIndicator size="small" color={Colors.dark[400]} />
          )}
        </View>

        <View style={styles.channelCard}>
          <View style={styles.channelAvatar}>
            <Text style={styles.channelAvatarText}>S</Text>
          </View>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>{CHANNEL_INFO.name}</Text>
            <Text style={styles.channelHandle}>{CHANNEL_INFO.handle}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark[950],
  },
  videoContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    padding: Spacing.md,
  },
  videoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.lg,
    color: '#fff',
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.xs,
    color: Colors.dark[400],
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.dark[800],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  channelAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.lg,
    color: '#fff',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: FontSize.md,
    color: '#fff',
  },
  channelHandle: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.xs,
    color: Colors.dark[400],
    marginTop: 2,
  },
});
