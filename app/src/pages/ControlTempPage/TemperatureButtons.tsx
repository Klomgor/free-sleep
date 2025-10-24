import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Box } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useControlTempStore } from './controlTempStore.tsx';
import { useAppStore } from '@state/appStore.tsx';
import { postDeviceStatus } from '@api/deviceStatus.ts';
import { useSettings } from '@api/settings.ts';


type TemperatureButtonsProps = {
  refetch: any;
  currentTargetTemp: number;
}

const MIN_TEMP_F = 55;
const MAX_TEMP_F = 110;

export default function TemperatureButtons({ refetch, currentTargetTemp }: TemperatureButtonsProps) {
  const { side, setIsUpdating, isUpdating } = useAppStore();
  const { deviceStatus, setDeviceStatus, originalDeviceStatus } = useControlTempStore();
  const { data: settings } = useSettings();
  const isInAwayMode = settings?.[side].awayMode;
  const disabled = isUpdating || isInAwayMode;
  const theme = useTheme();
  const borderColor = theme.palette.grey[800];
  const iconColor = theme.palette.grey[500];

  const buttonStyle = {
    borderWidth: '2px',
    borderColor,
    width: 50,
    height: 50,
    borderRadius: '50%',
    minWidth: 0,
    padding: 0,
  };

  useEffect(() => {
    if (deviceStatus === undefined || originalDeviceStatus === undefined) return;
    if (deviceStatus[side].targetTemperatureF === originalDeviceStatus[side].targetTemperatureF) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsUpdating(true);
      await postDeviceStatus({
        [side]: {
          targetTemperatureF: deviceStatus[side].targetTemperatureF
        }
      })
        .then(() => {
          // Wait 1 second before refreshing the device status
          return new Promise((resolve) => setTimeout(resolve, 1_000));
        })
        .then(() => refetch())
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }, 2_000);

    return () => clearTimeout(timer); // Cleanup the timeout
  }, [deviceStatus?.[side].targetTemperatureF, originalDeviceStatus?.[side].targetTemperatureF]);

  const handleClick = (change: number) => {
    if (deviceStatus === undefined) return;
    setDeviceStatus({
      [side]: {
        targetTemperatureF: deviceStatus[side].targetTemperatureF + change,
      }
    });
  };

  if (isInAwayMode) return null;

  return (
    <Box
      sx={ {
        top: '75%',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '100px',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      } }
    >
      <Button
        variant="outlined"
        color="primary"
        sx={ buttonStyle }
        onClick={ () => handleClick(-1) }
        disabled={ disabled || currentTargetTemp <= MIN_TEMP_F }
      >
        <Remove sx={ { color: iconColor } }/>
      </Button>
      <Button
        variant="outlined"
        sx={ buttonStyle }

        onClick={ () => handleClick(1) }
        disabled={ disabled || currentTargetTemp >= MAX_TEMP_F }
      >
        <Add sx={ { color: iconColor } }/>
      </Button>
    </Box>
  );
}
