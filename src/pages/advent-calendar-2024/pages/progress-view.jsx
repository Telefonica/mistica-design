import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Stack, Text4, Text8, ButtonPrimary } from "@telefonica/mistica";
import { Buffer } from "buffer";

const ProgressView = () => {
  const [completedDays, setCompletedDays] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to encode data in Base64
  const base64Encode = (data) => {
    return Buffer.from(data).toString("base64");
  };

  // Function to decode Base64 data
  const base64Decode = (data) => {
    return Buffer.from(data, "base64").toString("utf-8");
  };
  // Function to parse completed days from the URL query string
  const getCompletedDaysFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const days = params.get("completedDays");
    return days ? base64Decode(days).split(",") : []; // Decode here
  };

  // Function to update the URL with completed days
  const updateUrlWithCompletedDays = (days) => {
    const params = new URLSearchParams(location.search);
    params.set("completedDays", base64Encode(days.join(","))); // Encode here
    navigate({ search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    // On mount, fetch completed days from the URL or local storage if not present
    const daysFromUrl = getCompletedDaysFromUrl();
    if (daysFromUrl.length > 0) {
      setCompletedDays(daysFromUrl);
    } else {
      const storedDays = localStorage.getItem("completedDays");
      if (storedDays) {
        const parsedDays = JSON.parse(storedDays);
        setCompletedDays(parsedDays);
        updateUrlWithCompletedDays(parsedDays); // Sync localStorage with the URL
      }
    }
  }, [location.search]);

  return (
    <Box padding={24}>
      <Stack space={16}>
        <Text4>Completed Days</Text4>
        {completedDays.length === 0 ? (
          <Text8>No days completed yet</Text8>
        ) : (
          <Stack space={8}>
            {completedDays.map((day) => (
              <Box key={day} padding={8} style={{ border: "1px solid #ccc" }}>
                <Text8>{day}</Text8>
              </Box>
            ))}
          </Stack>
        )}
        <ButtonPrimary
          onPress={() => {
            setCompletedDays([]);
            localStorage.removeItem("completedDays");
            updateUrlWithCompletedDays([]); // Clear the URL query parameter
          }}
        >
          Clear Completed Days
        </ButtonPrimary>
      </Stack>
    </Box>
  );
};

export default ProgressView;
