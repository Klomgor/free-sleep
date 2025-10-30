import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import BedIcon from '@mui/icons-material/Bed';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Alert } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { useResizeDetector } from 'react-resize-detector';

import Header from '../Header';
import VitalsLineChart from '@components/VitalsLineChart.tsx';
import PageContainer from '../../PageContainer.tsx';
import SleepBarChart from '@components/SleepBarChart.tsx';
import SleepRecordCard from '@components/SleepRecordCard.tsx';
import VitalsSummaryCard from '@components/VitalsSummaryCard.tsx';
import { SleepRecord } from '../../../../../server/src/db/sleepRecordsSchema.ts';
import { useAppStore } from '@state/appStore.tsx';
import { useSleepRecords } from '@api/sleep.ts';
import { useTheme } from '@mui/material/styles';
import { useVitalsRecords } from '@api/vitals.ts';
import { useMovementRecords } from '@api/movement.ts';
import MovementChart from '@components/MovementChart.tsx';
import ErrorBoundary from '@components/ErrorBoundary.tsx';


const NoData = () => {
  return (
    <Alert severity="info">
      No data available for the selected time range
    </Alert>
  );
};


// eslint-disable-next-line react/no-multi-comp
export default function SleepPage() {
  const { width = 300, ref } = useResizeDetector();
  const { side } = useAppStore();
  const [startTime, setStartTime] = useState(moment().subtract(7, 'days'));
  const [endTime, setEndTime] = useState(moment().add(2, 'day'));
  const [selectedSleepRecord, setSelectedSleepRecord] = useState<SleepRecord | undefined>(undefined);

  // Fetch sleep records for the selected week
  const { data: sleepRecords, refetch } = useSleepRecords({
    side,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString()
  });

  const { data: vitalsRecords } = useVitalsRecords({
    side,
    startTime: selectedSleepRecord?.entered_bed_at,
    endTime: selectedSleepRecord?.left_bed_at
  },
  selectedSleepRecord !== undefined
  );

  const { data: movementRecords } = useMovementRecords({
    side,
    startTime: selectedSleepRecord?.entered_bed_at,
    endTime: selectedSleepRecord?.left_bed_at
  },
  selectedSleepRecord !== undefined
  );


  useEffect(() => {
    // Default to last record selected
    if (sleepRecords?.length) {
      setSelectedSleepRecord(sleepRecords[sleepRecords.length - 1]);
    }
  }, [sleepRecords]);

  // Function to move to the previous week
  const handlePrevWeek = () => {
    const newStartTime = startTime.clone().subtract(1, 'week');
    setStartTime(newStartTime);
    const newEndTime = endTime.clone().subtract(1, 'week');
    setEndTime(newEndTime);
  };

  // Function to move to the next week
  const handleNextWeek = () => {
    const newStartTime = startTime.clone().add(1, 'week');
    setStartTime(newStartTime);
    const newEndTime = endTime.clone().add(1, 'week');
    setEndTime(newEndTime);
  };
  const theme = useTheme();
  const isNextDisabled = endTime && moment(endTime).isSameOrAfter(moment(), 'week');

  return (
    <ErrorBoundary componentName="Sleep page">
      <PageContainer containerProps={ { ref } } sx={ { mb: 15, gap: 1, mt: 0 } }>
        <Header title="Sleep" icon={ <BedIcon/> }/>
        <Box
          sx={ {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '80%',
            color: theme.palette.grey[500]
          } }>
          { /* Previous Button */ }
          <NavigateBeforeIcon onClick={ handlePrevWeek } sx={ { cursor: 'pointer' } }/>

          { /* Title - Always Centered */ }
          <Typography>
            { startTime.format('YYYY-MM-DD') } - { endTime.format('YYYY-MM-DD') }
          </Typography>

          { /* Next Button (Hidden but Maintains Space) */ }
          <Box sx={ { width: 24, display: 'flex', justifyContent: 'center' } }>
            { !isNextDisabled && (
              <NavigateNextIcon onClick={ handleNextWeek } sx={ { cursor: 'pointer' } }/>
            ) }
          </Box>
        </Box>
        {
          sleepRecords?.length === 0 && <NoData/>
        }
        <SleepBarChart
          width={ width }
          height={ 300 }
          sleepRecords={ sleepRecords }
          selectedSleepRecord={ selectedSleepRecord }
          setSelectedSleepRecord={ setSelectedSleepRecord }
        />
        <Box sx={ { 'width': width } }>
          {
            selectedSleepRecord &&
            (
              <>
                <SleepRecordCard sleepRecord={ selectedSleepRecord } refetch={ refetch }/>
                <VitalsSummaryCard
                  startTime={ selectedSleepRecord.entered_bed_at }
                  endTime={ selectedSleepRecord.left_bed_at }
                />
                <ErrorBoundary componentName="Heart rate chart">
                  <VitalsLineChart vitalsRecords={ vitalsRecords } metric="heart_rate"/>
                </ErrorBoundary>
                <ErrorBoundary componentName="Movement chart">
                  <MovementChart movementRecords={ movementRecords || [] } label="Movement"/>
                </ErrorBoundary>
                <ErrorBoundary componentName="Breathing rate chart">
                  <VitalsLineChart vitalsRecords={ vitalsRecords } metric="breathing_rate"/>
                </ErrorBoundary>
                <ErrorBoundary componentName="HRV chart">
                  <VitalsLineChart vitalsRecords={ vitalsRecords } metric="hrv"/>
                </ErrorBoundary>
              </>
            )
          }
        </Box>
      </PageContainer>
    </ErrorBoundary>
  );
}
