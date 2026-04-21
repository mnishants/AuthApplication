import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityData, CountryData, RegisterAgentPayload, RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  countries: CountryData[] = [];
  filteredCities: CityData[] = [];
  submitSuccessMessage: string = '';
  submitErrorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
  }

  loadCountries(): void {
    this.registrationService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Failed to load countries:', error);
        this.countries = [];
      }
    });
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      countryId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      registrationRefNo: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companyAddress: ['', [Validators.required]],
      landlineNumber: ['', [Validators.pattern(/^[0-9\-\+\(\)\s]+$/)]],
      website: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)]],
      fax: ['', [Validators.pattern(/^[0-9\-\+\(\)\s]+$/)]],
      companyEmail: ['', [Validators.required, Validators.email]],
      licenseNumber: ['', [Validators.required]],
      contactPersonName: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\(\)\s]{10,}$/)]],
      allowedSubusers: ['', [Validators.required, Validators.min(0)]],
      adminUserName: ['', [Validators.required]],
      subUserNames: [''],
      registrationStatus: ['PENDING', [Validators.required]],
      isActive: [true, [Validators.required]]
    });

    // Watch for country changes to filter cities
    this.registerForm.get('countryId')?.valueChanges.subscribe(countryId => {
      this.onCountryChange(countryId);
    });
  }

  onCountryChange(countryId: number | null): void {
    this.registerForm.patchValue({ cityId: null });

    if (!countryId) {
      this.filteredCities = [];
      return;
    }

    this.registrationService.getCitiesByCountry(countryId).subscribe({
      next: (cities) => {
        this.filteredCities = cities;
      },
      error: (error) => {
        console.error('Failed to load cities:', error);
        this.filteredCities = [];
      }
    });
  }

  onSubmit(): void {
    this.submitSuccessMessage = '';
    this.submitErrorMessage = '';

    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const formValue = this.registerForm.value;
      const payload: RegisterAgentPayload = {
        agenT_ID: 0,
        countryId: Number(formValue.countryId),
        cityId: Number(formValue.cityId),
        companyName: String(formValue.companyName || ''),
        companyAddress: String(formValue.companyAddress || ''),
        landlineNumber: String(formValue.landlineNumber || ''),
        website: String(formValue.website || ''),
        faxNumber: String(formValue.fax || ''),
        companyEmail: String(formValue.companyEmail || ''),
        licenseNumber: String(formValue.licenseNumber || ''),
        contactPersonName: String(formValue.contactPersonName || ''),
        designation: String(formValue.designation || ''),
        mobileNumber: String(formValue.mobileNumber || ''),
        numberOfProposedUsers: Number(formValue.allowedSubusers || 0),
        adminUserName: String(formValue.adminUserName || ''),
        subUserNames: this.parseSubUserNames(formValue.subUserNames),
      };

      console.log('Registration Payload JSON:', JSON.stringify(payload, null, 2));
      // Call API service to submit the form
      this.registrationService.submitRegistration(payload).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.submitSuccessMessage = response?.message || 'Registration successful.';
          this.isSubmitting = false;
          this.resetForm();
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.submitErrorMessage = error?.error?.message || 'Registration failed. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.submitErrorMessage = 'Please fill all required fields correctly.';
    }
  }

  resetForm(): void {
    this.registerForm.reset({
      countryId: null,
      cityId: null,
      adminUserName: '',
      subUserNames: '',
      registrationStatus: 'PENDING',
      isActive: true
    });
    this.filteredCities = [];
    this.submitErrorMessage = '';
  }

  private parseSubUserNames(subUserNames: string | null | undefined): string[] {
    if (!subUserNames) {
      return [];
    }

    return subUserNames
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  }

  get countryId() {
    return this.registerForm.get('countryId');
  }

  get cityId() {
    return this.registerForm.get('cityId');
  }

  get registrationRefNo() {
    return this.registerForm.get('registrationRefNo');
  }

  get companyName() {
    return this.registerForm.get('companyName');
  }

  get companyAddress() {
    return this.registerForm.get('companyAddress');
  }

  get landlineNumber() {
    return this.registerForm.get('landlineNumber');
  }

  get website() {
    return this.registerForm.get('website');
  }

  get fax() {
    return this.registerForm.get('fax');
  }

  get companyEmail() {
    return this.registerForm.get('companyEmail');
  }

  get licenseNumber() {
    return this.registerForm.get('licenseNumber');
  }

  get contactPersonName() {
    return this.registerForm.get('contactPersonName');
  }

  get designation() {
    return this.registerForm.get('designation');
  }

  get mobileNumber() {
    return this.registerForm.get('mobileNumber');
  }

  get allowedSubusers() {
    return this.registerForm.get('allowedSubusers');
  }

  get adminUserName() {
    return this.registerForm.get('adminUserName');
  }

  get subUserNames() {
    return this.registerForm.get('subUserNames');
  }

  get registrationStatus() {
    return this.registerForm.get('registrationStatus');
  }

  get isActive() {
    return this.registerForm.get('isActive');
  }
}