import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  @Input() startsFromRight;

  questions = [
    { label: 'Czy mogę dokonać rezerwacji?', isActive: true },
    { label: 'Czy muszę przyznawać napiwki?', isActive: false },
    { label: 'Odwoływanie zamówienia', isActive: false },
  ]

  setActiveQuestion(index: number) {
    let newQuestions = this.questions.map(q => ({ ...q, isActive: false }));
    newQuestions[index].isActive = !this.questions[index].isActive;
    this.questions = newQuestions;
  }

  constructor() {}

  ngOnInit() {}

}
