import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../Student';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-database',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-database.component.html',
  styleUrl: './student-database.component.css'
})
export class StudentDatabaseComponent implements OnInit {
  students: Student[] = [];
  searchQuery: string = '';
  selectedYear: string = '';
  selectedBranch: string = '';
  selectedEmployeeType: string = '';
  selectedBacklogs: string = '';
  selectedCgpa: string = '≥ 6.0';
  cgpaOptions: string[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private studentService: StudentsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cgpaOptions = ['≥ 5.0', '≥ 5.5', '≥ 6.0', '≥ 6.5', '≥ 7.0', '≥ 7.5', '≥ 8.0']
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.isLoading = true;
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch student data.';
        this.isLoading = false;
      }
    });
  }

  filteredStudents(): Student[] {
    return this.students.filter(student => {
      const matchName = student.name?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchYear = !this.selectedYear || student.year === this.selectedYear;
      const matchBranch = !this.selectedBranch || student.branch === this.selectedBranch;
      const matchEmployeeType = !this.selectedEmployeeType || student.employee_type === this.selectedEmployeeType;
      const matchBacklogs = this.selectedBacklogs === '' ||
        (this.selectedBacklogs === 'true' ? (student.backlogs ?? 0) > 0 : (student.backlogs ?? 0) === 0);
      const matchCgpa = parseFloat((student.cgpa ?? '0').toString()) >= parseFloat(this.selectedCgpa);
      return matchName && matchYear && matchBranch && matchEmployeeType && matchCgpa && matchBacklogs;
    });
  }
}
