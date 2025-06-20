import { StyleSheet, Text, View } from 'react-native';

export default function PerformanceCard({
  day,
  start,
  end,
  venue,
  description,
}: {
  day: string;
  start: string;
  end: string;
  venue: string;
  description: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>
        {day} @ {venue.replace(/-/g, ' ')}: {start}–{end}
      </Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ddd',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'black',
  },
  description: {
    fontSize: 14,
    color: 'black',
  },
});
