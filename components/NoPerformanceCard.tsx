import { Colors } from '@/constants/Colors';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  description: string;
};

/**
 * Card component displayed when no performances are available
 */
export default function NoPerformanceCard({ description }: Props) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.heading}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 5,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    minHeight: 75,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: 0.6
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    flex: 1,
    paddingRight: 10,
  },
});
