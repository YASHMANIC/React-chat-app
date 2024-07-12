import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';

export const useUserStore = create((set) => ({
  chatId: null,
  user:null,
 isCurrentUserBlocked:false,
 isReceiverBlocked:false
}))