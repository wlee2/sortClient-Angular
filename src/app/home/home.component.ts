import { Component, OnInit } from '@angular/core';
import { SortService } from '../service/sort.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  inputTypes = ['int', 'double', 'string'];
  sortTypes = ['QuickSort', 'BubbleSort'];
  splitedData = [];
  result: any = [];
  currentStep: any = [];
  error: string;
  stepAnimationProgress: number = 0;
  stepAnimationProgressMax: number = 0;

  timer = null;

  selectedInputType: string = '';
  selectedSortType: string = '';
  inputString: string = '';

  constructor(
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.selectedInputType = this.inputTypes[0];
    this.selectedSortType = this.sortTypes[0];
  }

  setClear() {
    if (this.timer) {
      this.timer.forEach(e => {
        window.clearTimeout(e);
      });
      
      this.timer = null;
    }
    this.splitedData = [];
    this.error = '';
    this.result = [];
    this.currentStep = [];
    this.stepAnimationProgress = 0;
  }

  submit() {
    this.setClear();
    if (this.inputString !== '') {
      const separatedByCommas = this.inputString.split(',');
      if (separatedByCommas.length <= 500 && separatedByCommas.length >= 1) {
        separatedByCommas.forEach(e => {
          if (e.trim().length > 0) {
            const result = this.typeChecker(e.trim());
            if (result) {
              this.splitedData.push(result);
            }
            else {
              this.error = "input type error";
            }
          }
          else {
            this.error = 'found a empty string'
          }
        });
      }
      else {
        this.error = "input size is overflowed";
      }
    }
    else {
      this.error = "input is required";
    }

    if (this.error === '') {
      this.dataSortRequest();
    }
  }

  typeChecker(data: any): number | string | null {
    const parsedNumber = parseFloat(data);
    if (this.selectedInputType === 'string' && !parsedNumber && data.length < 10) {
      return data;
    }
    else if (this.selectedInputType === 'int') {
      const parsedNumber = parseFloat(data);
      if (Number.isSafeInteger(parsedNumber) && parsedNumber % 1 === 0) {
        return parsedNumber;
      }
    }
    else if (this.selectedInputType === 'double') {
      const parsedNumber = parseFloat(data);
      return parsedNumber;
    }
    return null;
  }

  dataSortRequest() {
    if (this.selectedInputType === 'int') {
      this.sortService.postUnsortedDataIntType(this.splitedData, this.selectedSortType).subscribe(
        res => {
          console.log(res);
          this.result = res;
          this.setAnimation();
        },
        error => {
          this.error = error.data;
        }
      )
    }
    else if (this.selectedInputType === 'double') {
      this.sortService.postUnsortedDataDoubleType(this.splitedData, this.selectedSortType).subscribe(
        res => {
          this.result = res;
          console.log(res);
          this.setAnimation();
        },
        error => {
          this.error = error.data;
        }
      )
    }
    else if (this.selectedInputType === 'string') {
      this.sortService.postUnsortedDataStringType(this.splitedData, this.selectedSortType).subscribe(
        res => {
          this.result = res;
          console.log(res);
          this.setAnimationStringType();
        },
        error => {
          this.error = error.data;
        }
      )
    }
  }

  setAnimation() {
    const arrSum = this.result[0].reduce((a, b) => {
      return a + b
    }, 0);
    this.stepAnimationProgressMax = this.result.length;
    if (this.timer === null) {
      this.timer = this.result.map((step, i) => {
        return setTimeout(() => {
          this.currentStep = step.map(element => {
            return {
              value: element,
              percent: (element / arrSum * 100) * 2.5
            }
          });
          this.stepAnimationProgress = (i + 1) / this.stepAnimationProgressMax * 100;
        }, i * 300)
      });
    }
  }

  setAnimationStringType() {
    this.stepAnimationProgressMax = this.result.length;
    if (this.timer === null) {
      this.timer = this.result.map((step, i) => {
        return setTimeout(() => {
          this.currentStep = step.map(element => {
            return {
              value: element,
              percent: 100
            }
          });
          this.stepAnimationProgress = (i + 1) / this.stepAnimationProgressMax * 100;
        }, i * 300)
      });
    }
  }
}
