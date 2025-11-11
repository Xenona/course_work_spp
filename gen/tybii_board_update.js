export function write_BoardGroupUpdate(w, s) {
  w.writeId(s.id);
  w.writeString(s.memberId);
}

export function write_BoardAddUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardDeleteUpdate(w, s) {
  w.writeId(s.id);
}

export function write_BoardStrokeUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardMoveUpdate(w, s) {
  w.writeId(s.id);
  w.writeNumber(s.deltaX);
  w.writeNumber(s.deltaY);
}

export function write_BoardAddPointUpdate(w, s) {
  w.writeId(s.id);
  w.writeNumber(s.pointX);
  w.writeNumber(s.pointY);
}

export function write_BoardSetImageUpdate(w, s) {
  w.writeId(s.id);
  w.writeString(s.src);
  w.writeNumber(s.width);
  w.writeNumber(s.height);
}

export function write_BoardShapeUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardUpdate(w, s) {
  switch(s.type) {
  case "addMember":
    w.writeBits(0, 3);
    write_BoardGroupUpdate(w, s);
    break;

  case "addObject":
    w.writeBits(1, 3);
    write_BoardAddUpdate(w, s);
    break;

  case "deleteObject":
    w.writeBits(2, 3);
    write_BoardDeleteUpdate(w, s);
    break;

  case "setStroke":
    w.writeBits(3, 3);
    write_BoardStrokeUpdate(w, s);
    break;

  case "move":
    w.writeBits(4, 3);
    write_BoardMoveUpdate(w, s);
    break;

  case "addPoint":
    w.writeBits(5, 3);
    write_BoardAddPointUpdate(w, s);
    break;

  case "setImage":
    w.writeBits(6, 3);
    write_BoardSetImageUpdate(w, s);
    break;

  case "setShape":
    w.writeBits(7, 3);
    write_BoardShapeUpdate(w, s);
    break;

  }
}

export function read_BoardGroupUpdate(r) {
  const s = {};
  s.type = "addMember";
  s.id = r.readId();
  s.memberId = r.readString();
  return s;
}

export function read_BoardAddUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardDeleteUpdate(r) {
  const s = {};
  s.type = "deleteObject";
  s.id = r.readId();
  return s;
}

export function read_BoardStrokeUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardMoveUpdate(r) {
  const s = {};
  s.id = r.readId();
  s.type = "move";
  s.deltaX = r.readNumber();
  s.deltaY = r.readNumber();
  return s;
}

export function read_BoardAddPointUpdate(r) {
  const s = {};
  s.id = r.readId();
  s.type = "addPoint";
  s.pointX = r.readNumber();
  s.pointY = r.readNumber();
  return s;
}

export function read_BoardSetImageUpdate(r) {
  const s = {};
  s.id = r.readId();
  s.type = "setImage";
  s.src = r.readString();
  s.width = r.readNumber();
  s.height = r.readNumber();
  return s;
}

export function read_BoardShapeUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardUpdate(r) {
  switch(r.readBits(3)) {
  case 0:
    return read_BoardGroupUpdate(r);

  case 1:
    return read_BoardAddUpdate(r);

  case 2:
    return read_BoardDeleteUpdate(r);

  case 3:
    return read_BoardStrokeUpdate(r);

  case 4:
    return read_BoardMoveUpdate(r);

  case 5:
    return read_BoardAddPointUpdate(r);

  case 6:
    return read_BoardSetImageUpdate(r);

  case 7:
    return read_BoardShapeUpdate(r);

  }
}

