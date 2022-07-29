import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NoteService } from './../../note.service';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private _note: NoteService,
    private _AuthService: AuthService,
    private _Renderer2: Renderer2
  ) {}
  // View Child To Rendare as Refrance
  @ViewChild('btnAdd', { static: false }) btnAdd: ElementRef | undefined;
  @ViewChild('btnUpdate') btnUpdate: ElementRef | undefined;
  isLoading: boolean = false;
  disabled: boolean = false;
  userToken: string | null = this._AuthService.encodeToken;
  userId: string | null = this._AuthService.idUser;
  notesList: any[] = [];
  addOrUpdate: boolean = true;
  curentNoteId!: string;
  msgData!: string;
  termSearch: string = '';
  // ------------------ Note Form
  noteForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    desc: new FormControl(null, [Validators.required]),
  });
  ngOnInit(): void {
    this.getUserNotes();
  }

  // ------------------ Add Note
  changbutton(): void {
    this.addOrUpdate = true;
    this._Renderer2.removeClass(this.btnAdd?.nativeElement, 'd-none');
    this._Renderer2.addClass(this.btnUpdate?.nativeElement, 'd-none');
    this.noteForm.reset();
  }
  addNoteForm(dataNote: FormGroup): void {
    console.log('add start');

    this.addOrUpdate = true;
    this._Renderer2.removeClass(this.btnAdd?.nativeElement, 'd-none');
    this._Renderer2.addClass(this.btnUpdate?.nativeElement, 'd-none');
    this.isLoading = true;
    this.disabled = true;
    const noteObject: any = {
      title: dataNote.value.title,
      desc: dataNote.value.desc,
      citizenID: this._AuthService.idUser,
      token: this._AuthService.encodeToken,
    };
    console.log(noteObject);
    this._note.addNote(noteObject).subscribe({
      next: (response) => {
        if (response.message === 'success') {
          // add alert Done
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000,
          });
          this.getUserNotes();
          this.noteForm.reset();
          $('#addNoteModal').modal('hide');
          console.log(response);
        }
      },
      complete: () => {
        this.isLoading = false;
        this.disabled = false;
      },
    });
  }

  // ---------------- get user notes
  getUserNotes(): void {
    const objectData: object = {
      token: this.userToken,
      userID: this.userId,
    };
    this._note.getNoteUser(objectData).subscribe({
      next: (response) => {
        console.log('msg', response);
        if (response.message === 'success') {
          this.msgData = '';
          this.notesList = response.Notes;
        }else if (response.message === 'no notes found') {
          this.msgData = 'no notes found';
          this.notesList = []
        }
         else {
          this.notesList = response.Notes;
          this.msgData = response.message;
        }
      },
    });
  }

  // delete Notes
  deleteNote(noteData: { _id: string }): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const objectDelete: Object = {
          body: {
            NoteID: noteData._id,
            token: this.userToken,
          },
        };
        console.log('object delete create', objectDelete);
        this._note.deleteNote(objectDelete).subscribe({
          next: (response) => {
            console.log(response);
            
            this.getUserNotes();
          },
          complete: () => {
            Swal.fire('Deleted!', 'Your Note has been deleted.', 'success');
          },
        });
      }
    });
  }
  // delete All Notes
  deleteNotes(): Observable<any> {
    return new Observable(() => {
      const notesIdAndToken: any[] = [];
      this.notesList.forEach((note) => {
        const objectDelete: Object = {
          body: {
            NoteID: note._id,
            token: this.userToken,
          },
        };
        notesIdAndToken.push(objectDelete);
      });
      console.log(notesIdAndToken);
      notesIdAndToken.forEach((item, index) => {
        this._note.deleteNote(item).subscribe({
          next: (response) => {
            if (response.message == 'success') {
              if (index == notesIdAndToken.length - 1) {
                this.getUserNotes();
              }
            }
          },
        });
      });
    });
  }
  // ------------ update note show modal
  updateShowData(dataNote: FormGroup, updateData: any): void {
    this.curentNoteId = updateData._id;
    this.addOrUpdate = false;
    dataNote.get('title')?.setValue(updateData.title);
    dataNote.get('desc')?.setValue(updateData.desc);
    this._Renderer2.addClass(this.btnAdd?.nativeElement, 'd-none');
    this._Renderer2.removeClass(this.btnUpdate?.nativeElement, 'd-none');
  }

  // ------------ update note change data
  updateNote(dataNote: FormGroup): void {
    console.log('update start');
    this.isLoading = true;
    this.disabled = true;
    const noteObject: any = {
      title: dataNote.value.title,
      desc: dataNote.value.desc,
      NoteID: this.curentNoteId,
      token: this._AuthService.encodeToken,
    };
    console.log('update objec', noteObject);
    this._note.updateNote(noteObject).subscribe({
      next: (response) => {
        console.log(response);
        if (response.message === 'updated') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your Note has been Updated',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getUserNotes();
          this.noteForm.reset();
          $('#addNoteModal').modal('hide');
        } else {
          console.log('update false');
        }
      },
      complete: () => {
        this.isLoading = false;
        this.disabled = false;
      },
    });
  }

  // Track By Array
  notes(index: number, note: any): number {
    return note.index;
  }
  // Delete All Data
  deleteAll(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteNotes().subscribe({
          complete: () => {
            Swal.fire('Deleted!', 'Your Note has been deleted.', 'success');
          },
        });
        this.notesList = [];
        this.msgData = 'no notes found';
      }
    });
  }
}
