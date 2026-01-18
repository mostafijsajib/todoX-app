// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './Task/task';
import subjectSlice from './Subject/subject';
import examSlice from './Exam/exam';
import scheduleSlice from './Schedule/schedule';
import gradeSlice from './Grade/grade';
import settingsSlice from './Settings/settings';

export const store = configureStore({
  reducer: {
    task: taskSlice,
    subject: subjectSlice,
    exam: examSlice,
    schedule: scheduleSlice,
    grade: gradeSlice,
    settings: settingsSlice,
  },
});
