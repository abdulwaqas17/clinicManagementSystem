"use client";

import { AppointmentProvider } from "./appointmentContext";
import { CaseHistoryProvider } from "./caseHistoryContext";
import { DoctorProvider } from "./doctorContext";
import { ProfileProvider } from "./profileContext";
import { ReceptionistProvider } from "./receptionistContext";
import { RoomProvider } from "./roomContext";
import { UserProvider } from "./usersContext";

export const AppProvider = ({ children }) => {
  return (
    <CaseHistoryProvider>
      <DoctorProvider>
        <ReceptionistProvider>
          <ProfileProvider>
            <UserProvider>
              <RoomProvider>
                <AppointmentProvider>{children}</AppointmentProvider>
              </RoomProvider>
            </UserProvider>
          </ProfileProvider>
        </ReceptionistProvider>
      </DoctorProvider>
    </CaseHistoryProvider>
  );
};
