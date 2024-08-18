export interface User {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
    status: 'ACTIVE' | 'INACTIVE';
  }