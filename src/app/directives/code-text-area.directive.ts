import { Directive, ElementRef, HostListener, OnInit } from "@angular/core";

@Directive({
  selector: "[app-codearea]",
})
export class CodeTextAreaDirective implements OnInit {
  htmlTextArea: HTMLTextAreaElement;
  constructor(private el: ElementRef) {}

  async ngOnInit() {
    this.htmlTextArea = await this.el.nativeElement.getInputElement();
  }

  @HostListener("ionInput", ["$event"])
  onCodeChange(event) {
    if (
      event.detail.inputType != "insertText" &&
      event.detail.inputType != "insertLineBreak"
    )
      return;
    const autosymbols = {
      "{": "}",
      "[": "]",
      "(": ")",
    };

    let caret = event.detail.target.selectionStart; // caret location

    let str_before = event.detail.target.value.slice(0, caret); //return start -> \n
    let str_after = event.detail.target.value.slice(caret); //return start -> \n

    if (str_before[caret - 1] == "\n") {
      // check if last input is \n
      let lines_before_newline = str_before.split("\n").reverse();

      for (let line of lines_before_newline.slice(1)) {
        if (line.trim() == "") {
          continue;
        }
        let spaceBefore = line.match(/^\s{0,}/g)[0];

        let new_string = str_before + spaceBefore + str_after;
        this.htmlTextArea.value = new_string;

        this.htmlTextArea.setSelectionRange(
          caret + spaceBefore.length,
          caret + spaceBefore.length
        );
        return;
      }
    } else if (autosymbols[str_before[caret - 1]] != undefined) {
      //if last input is a paranthesis
      this.htmlTextArea.value =
        str_before + autosymbols[str_before[caret - 1]] + str_after;
      this.htmlTextArea.setSelectionRange(caret, caret);
    }
  }
}
